package com.example.models

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface AddressDao {
    @Query("SELECT * FROM addresses WHERE status = 'published' ORDER BY title ASC")
    fun getPublishedAddresses(): Flow<List<Address>>

    @Query("SELECT * FROM addresses WHERE slug = :slug LIMIT 1")
    fun getAddressBySlug(slug: String): Flow<Address?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(addresses: List<Address>)

    @Update
    suspend fun update(address: Address)

    @Query("UPDATE addresses SET isFavorite = :isFavorite WHERE id = :id")
    suspend fun updateFavorite(id: String, isFavorite: Boolean)

    @Query("SELECT COUNT(*) FROM addresses")
    suspend fun getCount(): Int
}
