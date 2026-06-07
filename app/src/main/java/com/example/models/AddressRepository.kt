package com.example.models

import android.content.Context
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map

class AddressRepository(context: Context) {
    private val db = AppDatabase.getDatabase(context)
    private val dao = db.addressDao()

    // Expose reactive stream of published addresses
    val publishedAddresses: Flow<List<Address>> = dao.getPublishedAddresses()

    // Retrieve an address by its slug
    fun getAddressBySlug(slug: String): Flow<Address?> {
        return dao.getAddressBySlug(slug)
    }

    // Toggle the favorite status of a luxury address
    suspend fun toggleFavorite(id: String, currentStatus: Boolean) {
        dao.updateFavorite(id, !currentStatus)
    }

    // Ensure database is seeded with initial curated items
    suspend fun checkAndSeedDatabase() {
        val count = dao.getCount()
        if (count == 0) {
            dao.insertAll(SeedData.initialAddresses)
        }
    }

    // Categories source of truth (can expand or pull from server)
    fun getCategories(): List<Category> = SeedData.categories

    // Destinations source of truth
    fun getDestinations(): List<Destination> = SeedData.destinations
}
