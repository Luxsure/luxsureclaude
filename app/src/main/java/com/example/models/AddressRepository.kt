package com.example.models

import android.content.Context
import com.example.BuildConfig
import com.example.data.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.doubleOrNull

sealed class SyncResult {
    object Idle : SyncResult()
    object Syncing : SyncResult()
    data class Success(val count: Int) : SyncResult()
    data class Error(val message: String) : SyncResult()
    object NotConfigured : SyncResult()
}

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

    suspend fun syncFromSupabase(): SyncResult = withContext(Dispatchers.IO) {
        val url = try { BuildConfig.SUPABASE_URL } catch (e: Exception) { "" }
        val key = try { BuildConfig.SUPABASE_ANON_KEY } catch (e: Exception) { "" }
        val isConfigured = url.isNotBlank() && !url.contains("YOUR_SUPABASE") && key.isNotBlank() && !key.contains("YOUR_SUPABASE")

        if (isConfigured) {
            try {
                android.util.Log.d("AddressRepository", "Syncing directly from Supabase...")
                val client = SupabaseClient.client
                val response = client.postgrest["addresses"].select()
                val rawJson = response.data
                android.util.Log.d("AddressRepository", "Raw JSON from Supabase: $rawJson")

                var remoteRows: List<AddressRow> = emptyList()
                try {
                    remoteRows = response.decodeList<AddressRow>()
                } catch (decodeEx: Exception) {
                    android.util.Log.e("AddressRepository", "Standard decodeList failed, using manual parse fallback: ${decodeEx.message}", decodeEx)
                    try {
                        val jsonElement = Json.parseToJsonElement(rawJson)
                        val jsonArray = jsonElement.jsonArray
                        remoteRows = jsonArray.map { element ->
                            val obj = element.jsonObject
                            
                            fun getStr(key: String): String? = obj[key]?.jsonPrimitive?.contentOrNull
                            fun getBool(key: String): Boolean? = obj[key]?.jsonPrimitive?.booleanOrNull ?: obj[key]?.jsonPrimitive?.contentOrNull?.toBooleanStrictOrNull()
                            fun getDouble(key: String): Double? = obj[key]?.jsonPrimitive?.doubleOrNull ?: obj[key]?.jsonPrimitive?.contentOrNull?.toDoubleOrNull()
                            
                            fun getList(key: String): List<String>? {
                                return try {
                                    obj[key]?.jsonArray?.map { it.jsonPrimitive.content }
                                } catch (e: Exception) {
                                    val strVal = getStr(key)
                                    if (!strVal.isNullOrBlank()) {
                                        strVal.split(",").map { it.trim() }
                                    } else {
                                        null
                                    }
                                }
                            }
                            
                            AddressRow(
                                id = getStr("id"),
                                title = getStr("title"),
                                slug = getStr("slug"),
                                status = getStr("status"),
                                categorySlug = getStr("category_slug"),
                                destinationSlug = getStr("destination_slug"),
                                shortDescription = getStr("short_description") ?: getStr("description"),
                                editorialNote = getStr("editorial_note") ?: getStr("content"),
                                featuredImage = getStr("featured_image") ?: getStr("image") ?: getStr("cover_image"),
                                gallery = getList("gallery"),
                                address = getStr("address"),
                                phone = getStr("phone"),
                                email = getStr("email"),
                                websiteUrl = getStr("website_url") ?: getStr("website"),
                                instagramUrl = getStr("instagram_url") ?: getStr("instagram"),
                                openingHours = getStr("opening_hours"),
                                priceLevel = getStr("price_level"),
                                editorRating = getDouble("editor_rating"),
                                bestFor = getList("best_for"),
                                signatureExperience = getStr("signature_experience"),
                                atmosphere = getStr("atmosphere"),
                                tags = getList("tags"),
                                featured = getBool("featured"),
                                lat = getDouble("lat") ?: getDouble("latitude"),
                                lng = getDouble("lng") ?: getDouble("longitude")
                            )
                        }
                    } catch (manualEx: Exception) {
                        android.util.Log.e("AddressRepository", "Manual fallback parsing also failed: ${manualEx.message}", manualEx)
                        throw decodeEx
                    }
                }

                if (remoteRows.isNotEmpty()) {
                    val localAddresses = dao.getAllAddressesImmediate().associateBy { it.slug }
                    val remoteAddresses = remoteRows.map { row ->
                        val localCopy = localAddresses[row.slug]
                        row.toAddress().copy(isFavorite = localCopy?.isFavorite ?: false)
                    }
                    dao.insertAll(remoteAddresses)
                    android.util.Log.d("AddressRepository", "Successfully synced ${remoteAddresses.size} items from Supabase")
                    SyncResult.Success(remoteAddresses.size)
                } else {
                    SyncResult.Success(0)
                }
            } catch (e: Exception) {
                android.util.Log.e("AddressRepository", "Supabase sync task failed: ${e.message}", e)
                val cleanMessage = e.message ?: e.javaClass.simpleName
                SyncResult.Error(cleanMessage)
            }
        } else {
            android.util.Log.d("AddressRepository", "Supabase is not configured, using cache only.")
            SyncResult.NotConfigured
        }
    }

    // Categories source of truth (can expand or pull from server)
    fun getCategories(): List<Category> = SeedData.categories

    // Destinations source of truth
    fun getDestinations(): List<Destination> = SeedData.destinations
}
