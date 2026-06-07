package com.example.models

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class LuxsureViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = AddressRepository(application)

    private val _syncResult = MutableStateFlow<SyncResult>(SyncResult.Idle)
    val syncResult: StateFlow<SyncResult> = _syncResult.asStateFlow()

    init {
        viewModelScope.launch {
            repository.checkAndSeedDatabase()
            _syncResult.value = SyncResult.Syncing
            _syncResult.value = repository.syncFromSupabase()
        }
    }

    val categories = repository.getCategories()
    val destinations = repository.getDestinations()

    // Pre-computed O(1) lookup maps — categories and destinations are static seed data
    private val categoryNameMap: Map<String, String> =
        categories.associate { it.slug to it.name.lowercase() }
    private val destinationNameMap: Map<String, String> =
        destinations.associate { it.slug to it.name.lowercase() }
    private val destinationCountryMap: Map<String, String> =
        destinations.associate { it.slug to it.country.lowercase() }

    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    private val _selectedCategorySlug = MutableStateFlow<String?>(null)
    val selectedCategorySlug = _selectedCategorySlug.asStateFlow()

    private val _selectedDestinationSlug = MutableStateFlow<String?>(null)
    val selectedDestinationSlug = _selectedDestinationSlug.asStateFlow()

    private val _selectedPriceLevel = MutableStateFlow<String?>(null)
    val selectedPriceLevel = _selectedPriceLevel.asStateFlow()

    private val _showOnlyFavorites = MutableStateFlow(false)
    val showOnlyFavorites = _showOnlyFavorites.asStateFlow()

    private val _isRefreshing = MutableStateFlow(false)
    val isRefreshing = _isRefreshing.asStateFlow()

    val rawAddresses: StateFlow<List<Address>> = repository.publishedAddresses
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    // Consolidate 5 individual filter flows into a single typed struct so the
    // downstream combine only needs 2 typed inputs — no array casts needed.
    private data class FilterState(
        val query: String,
        val categorySlug: String?,
        val destinationSlug: String?,
        val priceLevel: String?,
        val onlyFavorites: Boolean
    )

    private val filterState: StateFlow<FilterState> = combine(
        _searchQuery,
        _selectedCategorySlug,
        _selectedDestinationSlug,
        _selectedPriceLevel,
        _showOnlyFavorites
    ) { query, category, dest, price, favs ->
        FilterState(query, category, dest, price, favs)
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.Eagerly,
        initialValue = FilterState("", null, null, null, false)
    )

    val filteredAddresses: StateFlow<List<Address>> = combine(
        rawAddresses,
        filterState
    ) { addresses, filter ->
        addresses.filter { address ->
            val matchesCategory =
                filter.categorySlug == null || address.categorySlug == filter.categorySlug
            val matchesDestination =
                filter.destinationSlug == null || address.destinationSlug == filter.destinationSlug
            val matchesPrice =
                filter.priceLevel == null || address.priceLevel == filter.priceLevel
            val matchesFav = !filter.onlyFavorites || address.isFavorite
            val matchesSearch = if (filter.query.isEmpty()) {
                true
            } else {
                val q = filter.query.lowercase()
                val catName = categoryNameMap[address.categorySlug] ?: ""
                val destName = destinationNameMap[address.destinationSlug] ?: ""
                val destCountry = destinationCountryMap[address.destinationSlug] ?: ""
                address.title.lowercase().contains(q) ||
                    address.shortDescription.lowercase().contains(q) ||
                    address.tags.any { it.lowercase().contains(q) } ||
                    address.address.lowercase().contains(q) ||
                    catName.contains(q) ||
                    destName.contains(q) ||
                    destCountry.contains(q)
            }
            matchesCategory && matchesDestination && matchesPrice && matchesFav && matchesSearch
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    // One stable StateFlow per slug — recompositions reuse the same instance instead
    // of spawning a new coroutine on every call.
    private val addressDetailCache = mutableMapOf<String, StateFlow<Address?>>()

    fun getAddressBySlug(slug: String): StateFlow<Address?> {
        return addressDetailCache.getOrPut(slug) {
            repository.getAddressBySlug(slug)
                .stateIn(
                    scope = viewModelScope,
                    started = SharingStarted.WhileSubscribed(5000),
                    initialValue = null
                )
        }
    }

    fun updateSearchQuery(query: String) { _searchQuery.value = query }
    fun selectCategory(slug: String?) { _selectedCategorySlug.value = slug }
    fun selectDestination(slug: String?) { _selectedDestinationSlug.value = slug }
    fun selectPriceLevel(level: String?) { _selectedPriceLevel.value = level }

    fun toggleFavoritesFilter() {
        _showOnlyFavorites.value = !_showOnlyFavorites.value
    }

    fun resetFilters() {
        _searchQuery.value = ""
        _selectedCategorySlug.value = null
        _selectedDestinationSlug.value = null
        _selectedPriceLevel.value = null
        _showOnlyFavorites.value = false
    }

    fun toggleFavorite(address: Address) {
        viewModelScope.launch {
            repository.toggleFavorite(address.id, address.isFavorite)
        }
    }

    fun refreshContent() {
        viewModelScope.launch {
            _isRefreshing.value = true
            _syncResult.value = SyncResult.Syncing
            _syncResult.value = repository.syncFromSupabase()
            _isRefreshing.value = false
        }
    }
}
