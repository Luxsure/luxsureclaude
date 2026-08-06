package com.example.screens.addresses

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Place
import androidx.compose.material3.*
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.models.Address
import com.example.models.LuxsureViewModel
import com.example.ui.theme.Gold
import com.example.ui.theme.Ink
import com.example.ui.theme.Ivory
import com.example.ui.theme.Line
import com.example.ui.theme.Muted
import com.example.widgets.AddressCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddressesScreen(
    viewModel: LuxsureViewModel,
    modifier: Modifier = Modifier,
    initialCategorySlug: String? = null,
    initialDestinationSlug: String? = null,
    onNavigateToAddressDetail: (String) -> Unit
) {
    // Collect states
    val addresses by viewModel.filteredAddresses.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCat by viewModel.selectedCategorySlug.collectAsState()
    val selectedDest by viewModel.selectedDestinationSlug.collectAsState()
    val selectedPrice by viewModel.selectedPriceLevel.collectAsState()
    val showOnlyFavs by viewModel.showOnlyFavorites.collectAsState()
    val isRefreshing by viewModel.isRefreshing.collectAsState()
    var isMapView by rememberSaveable { mutableStateOf(false) }
    var showDestinationBottomSheet by rememberSaveable { mutableStateOf(false) }

    // Apply initial nav params via LaunchedEffect — never call ViewModel directly in the body
    LaunchedEffect(initialCategorySlug, initialDestinationSlug) {
        if (initialCategorySlug != null || initialDestinationSlug != null) {
            initialCategorySlug?.let { viewModel.selectCategory(it) }
            initialDestinationSlug?.let { viewModel.selectDestination(it) }
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // ── TOP SEARCH HEADER ─────────────────────────────────────────────
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.background)
                .padding(horizontal = 16.dp, vertical = 12.dp)
        ) {
            TextField(
                value = searchQuery,
                onValueChange = { viewModel.updateSearchQuery(it) },
                placeholder = {
                    Text(
                        text = "Nom, catégorie, ville ou adresse...",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Muted
                    )
                },
                prefix = {
                    Icon(
                        imageVector = Icons.Filled.Search,
                        contentDescription = null,
                        tint = Muted,
                        modifier = Modifier.size(18.dp)
                    )
                },
                suffix = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(
                            onClick = { viewModel.updateSearchQuery("") },
                            modifier = Modifier.testTag("search_clear_button")
                        ) {
                            Icon(
                                imageVector = Icons.Filled.Clear,
                                contentDescription = "Effacer la recherche",
                                tint = Muted,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(4.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                    disabledContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("addresses_search_bar")
            )
        }

        // ── CATEGORIES SCROLLABLE FILTER ROW ──────────────────────────────
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 6.dp)
                .testTag("categories_scroll_filter"),
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // "Tous" chip
            item {
                FilterChip(
                    label = "Tous",
                    isSelected = selectedCat == null,
                    onClick = { viewModel.selectCategory(null) },
                    modifier = Modifier.testTag("chip_all_categories")
                )
            }

            items(viewModel.categories, key = { it.id }) { cat ->
                val localizedLabel = when (cat.slug) {
                    "palaces" -> "Hôtels"
                    "gastronomy" -> "Gastronomie"
                    "spas" -> "Spa"
                    "fashion" -> "Joaillerie"
                    else -> cat.name
                }
                FilterChip(
                    label = localizedLabel,
                    isSelected = selectedCat == cat.slug,
                    onClick = { viewModel.selectCategory(cat.slug) },
                    modifier = Modifier.testTag("chip_category_${cat.slug}")
                )
            }
        }

        // ── DESTINATIONS & PRICING SUB-FILTER ROW ─────────────────────────
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 8.dp)
                .testTag("sub_filters_row"),
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Favorites toggler
            item {
                Row(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(if (showOnlyFavs) Color.Red.copy(alpha = 0.1f) else Color.Transparent)
                        .border(
                            width = 0.5.dp,
                            color = if (showOnlyFavs) Color.Red else Line,
                            shape = CircleShape
                        )
                        .clickable { viewModel.toggleFavoritesFilter() }
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                        .testTag("chip_favorites"),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = if (showOnlyFavs) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                        contentDescription = null,
                        tint = if (showOnlyFavs) Color.Red else Muted,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Favoris",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                        color = if (showOnlyFavs) Color.Red else MaterialTheme.colorScheme.onSurface
                    )
                }
            }

            // Destinations filter preset
            item {
                DropdownFilter(
                    label = selectedDest?.uppercase() ?: "DESTINATIONS",
                    isSelected = selectedDest != null,
                    onClear = { viewModel.selectDestination(null) },
                    onClick = { showDestinationBottomSheet = true },
                    modifier = Modifier.testTag("chip_destinations_scroller")
                )
            }

            // Price Scroller
            item {
                DropdownFilter(
                    label = when (selectedPrice) {
                        "premium" -> "€€€"
                        "luxury" -> "€€€€"
                        "exceptional" -> "€€€€€"
                        else -> "TARIFS"
                    },
                    isSelected = selectedPrice != null,
                    onClear = { viewModel.selectPriceLevel(null) },
                    onClick = {
                        val prices = listOf("premium", "luxury", "exceptional")
                        val nextPrice = when (selectedPrice) {
                            null -> prices.first()
                            else -> {
                                val index = prices.indexOf(selectedPrice)
                                if (index < prices.size - 1) prices[index + 1] else null
                            }
                        }
                        viewModel.selectPriceLevel(nextPrice)
                    },
                    modifier = Modifier.testTag("chip_price_scroller")
                )
            }
        }

        HorizontalDivider(color = Line, thickness = 0.5.dp)

        // ── RESULTS COUNT & TOGGLE MAP/LIST ─────────────────────────────
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "${addresses.size} ADRESSES SÉLECTIONNÉES".uppercase(),
                style = MaterialTheme.typography.labelSmall,
                color = Muted,
                letterSpacing = 1.sp
            )
            
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(4.dp))
                    .border(width = 0.5.dp, color = Line, shape = RoundedCornerShape(4.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .clickable { isMapView = !isMapView }
                    .padding(horizontal = 12.dp, vertical = 6.dp)
                    .testTag("toggle_map_view_button"),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = if (isMapView) Icons.AutoMirrored.Filled.List else Icons.Filled.Place,
                    contentDescription = null,
                    tint = Gold,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isMapView) "LISTE" else "CARTE",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurface,
                    letterSpacing = 1.sp
                )
            }
        }

        HorizontalDivider(color = Line, thickness = 0.5.dp)

        // ── ADDRESSES LISTING / DATA VIEW SWAP ────────────────────────────
        Box(modifier = Modifier.weight(1f)) {
            PullToRefreshBox(
                isRefreshing = isRefreshing,
                onRefresh = { viewModel.refreshContent() },
                modifier = Modifier.fillMaxSize()
            ) {
                if (addresses.isEmpty()) {
                    EmptyStateView(
                        onReset = { viewModel.resetFilters() }
                    )
                } else if (isMapView) {
                    val geocodedAddresses = remember(addresses) { addresses.filter { it.lat != null && it.lng != null } }
                    if (geocodedAddresses.size < 3) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(20.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(
                                text = "Coordonnées limitées pour cette sélection",
                                style = MaterialTheme.typography.titleMedium,
                                color = Muted
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            LazyColumn(
                                verticalArrangement = Arrangement.spacedBy(12.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                items(addresses, key = { it.id }) { address ->
                                    val cat = viewModel.categories.find { it.slug == address.categorySlug }
                                    val dest = viewModel.destinations.find { it.slug == address.destinationSlug }
                                    AddressCard(
                                        address = address,
                                        categoryName = cat?.name,
                                        destinationName = dest?.name,
                                        onCardClick = { onNavigateToAddressDetail(address.slug) },
                                        onFavoriteToggle = { viewModel.toggleFavorite(address) }
                                    )
                                }
                            }
                        }
                    } else {
                        AddressMapView(
                            addresses = addresses,
                            onNavigateToAddressDetail = onNavigateToAddressDetail,
                            modifier = Modifier.testTag("address_map_view")
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .testTag("addresses_lazy_column"),
                        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 20.dp),
                        verticalArrangement = Arrangement.spacedBy(24.dp)
                    ) {
                        items(addresses, key = { it.id }) { address ->
                            val cat = viewModel.categories.find { it.slug == address.categorySlug }
                            val dest = viewModel.destinations.find { it.slug == address.destinationSlug }
                            AddressCard(
                                address = address,
                                categoryName = cat?.name,
                                destinationName = dest?.name,
                                onCardClick = { onNavigateToAddressDetail(address.slug) },
                                onFavoriteToggle = { viewModel.toggleFavorite(address) }
                            )
                        }
                    }
                }
            }
        }

        if (showDestinationBottomSheet) {
            ModalBottomSheet(
                onDismissRequest = { showDestinationBottomSheet = false },
                sheetState = rememberModalBottomSheetState(),
                containerColor = MaterialTheme.colorScheme.background
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp)
                        .padding(bottom = 32.dp)
                ) {
                    Text(
                        text = "SÉLECTIONNER UNE DESTINATION",
                        style = MaterialTheme.typography.labelSmall,
                        color = Muted,
                        letterSpacing = 2.sp,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )

                    viewModel.destinations.forEach { dest ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    viewModel.selectDestination(dest.slug)
                                    showDestinationBottomSheet = false
                                }
                                .padding(vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = dest.name,
                                style = MaterialTheme.typography.titleMedium,
                                color = if (selectedDest == dest.slug) Gold else MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.weight(1f)
                            )
                            if (selectedDest == dest.slug) {
                                Icon(
                                    imageVector = Icons.Filled.Place,
                                    contentDescription = "Active",
                                    tint = Gold,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                        HorizontalDivider(color = Line, thickness = 0.5.dp)
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                viewModel.selectDestination(null)
                                showDestinationBottomSheet = false
                            }
                            .padding(vertical = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Toutes les destinations".uppercase(),
                            style = MaterialTheme.typography.labelSmall,
                            color = Muted,
                            letterSpacing = 1.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun FilterChip(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(CircleShape)
            .background(if (isSelected) Ink else Color.Transparent)
            .border(width = 0.5.dp, color = if (isSelected) Ink else Line, shape = CircleShape)
            .clickable { onClick() }
            .padding(horizontal = 14.dp, vertical = 6.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(fontSize = 12.sp),
            color = if (isSelected) Ivory else MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
private fun DropdownFilter(
    label: String,
    isSelected: Boolean,
    onClear: () -> Unit,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .clip(CircleShape)
            .background(if (isSelected) Ink else Color.Transparent)
            .border(width = 0.5.dp, color = if (isSelected) Ink else Line, shape = CircleShape)
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
            color = if (isSelected) Ivory else MaterialTheme.colorScheme.onSurface
        )

        if (isSelected) {
            Spacer(modifier = Modifier.width(4.dp))
            Icon(
                imageVector = Icons.Filled.Clear,
                contentDescription = "Effacer le filtre",
                tint = Ivory,
                modifier = Modifier
                    .size(12.dp)
                    .clickable { onClear() }
            )
        }
    }
}

@Composable
private fun EmptyStateView(
    onReset: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp)
            .testTag("addresses_empty_state"),
        contentAlignment = Alignment.Center
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            shape = RoundedCornerShape(4.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(width = 0.5.dp, color = Line, shape = RoundedCornerShape(4.dp))
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Aucune adresse trouvée",
                    style = MaterialTheme.typography.headlineLarge.copy(fontSize = 22.sp),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = "Nous n'avons trouvé aucune adresse correspondant à vos critères dans l'édition actuelle du Luxsure Guide.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Muted,
                    modifier = Modifier.padding(bottom = 20.dp)
                )

                Button(
                    onClick = onReset,
                    colors = ButtonDefaults.buttonColors(containerColor = Ink),
                    shape = RoundedCornerShape(4.dp),
                    modifier = Modifier.testTag("reset_filters_button")
                ) {
                    Text(
                        text = "Réinitialiser les filtres",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Ivory
                    )
                }
            }
        }
    }
}
