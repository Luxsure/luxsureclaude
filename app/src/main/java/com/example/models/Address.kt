package com.example.models

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "addresses")
data class Address(
    @PrimaryKey val id: String,
    val title: String,
    val slug: String,
    val status: String, // draft | review | published | archived
    val categorySlug: String,
    val destinationSlug: String,
    val shortDescription: String,
    val editorialNote: String,
    val featuredImage: String,
    val gallery: List<String>,
    val address: String,
    val phone: String?,
    val email: String?,
    val websiteUrl: String?,
    val reservationUrl: String?,
    val instagramUrl: String?,
    val openingHours: String?,
    val priceLevel: String, // premium | luxury | exceptional
    val editorRating: Double, // 1–5
    val bestFor: List<String>,
    val signatureExperience: String,
    val atmosphere: String,
    val tags: List<String>,
    val featured: Boolean,
    val lat: Double?,
    val lng: Double?,
    val isFavorite: Boolean = false
)
