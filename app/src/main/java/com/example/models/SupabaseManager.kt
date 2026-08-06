package com.example.models

import android.util.Log
import com.example.BuildConfig
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object SupabaseManager {
    private const val TAG = "SupabaseManager"

    val isConfigured: Boolean
        get() = try {
            val url = BuildConfig.SUPABASE_URL
            val key = BuildConfig.SUPABASE_ANON_KEY
            url.isNotBlank() && !url.contains("YOUR_SUPABASE") && key.isNotBlank() && !key.contains("YOUR_SUPABASE")
        } catch (e: Exception) {
            false
        }

    val supabaseClient by lazy {
        if (isConfigured) {
            try {
                com.example.data.SupabaseClient.client
            } catch (e: Exception) {
                Log.e(TAG, "Failed to initialize Supabase: ${e.message}", e)
                null
            }
        } else {
            null
        }
    }

    suspend fun fetchAddresses(): List<AddressRow> = withContext(Dispatchers.IO) {
        val client = supabaseClient ?: return@withContext emptyList()
        try {
            client.postgrest["addresses"].select().decodeList<AddressRow>()
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching addresses from Supabase: ${e.message}", e)
            emptyList()
        }
    }
}
