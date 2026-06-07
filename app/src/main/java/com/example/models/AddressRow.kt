package com.example.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AddressRow(
    val id: String? = null,
    val title: String? = null,
    val slug: String? = null,
    val status: String? = null,
    @SerialName("category_slug") val categorySlug: String? = null,
    @SerialName("destination_slug") val destinationSlug: String? = null,
    @SerialName("short_description") val shortDescription: String? = null,
    @SerialName("editorial_note") val editorialNote: String? = null,
    @SerialName("featured_image") val featuredImage: String? = null,
    val gallery: List<String>? = emptyList(),
    val address: String? = null,
    val phone: String? = null,
    val email: String? = null,
    @SerialName("website_url") val websiteUrl: String? = null,
    @SerialName("reservation_url") val reservationUrl: String? = null,
    @SerialName("instagram_url") val instagramUrl: String? = null,
    @SerialName("opening_hours") val openingHours: String? = null,
    @SerialName("price_level") val priceLevel: String? = null,
    @SerialName("editor_rating") val editorRating: Double? = null,
    @SerialName("best_for") val bestFor: List<String>? = emptyList(),
    @SerialName("signature_experience") val signatureExperience: String? = null,
    val atmosphere: String? = null,
    val tags: List<String>? = emptyList(),
    val featured: Boolean? = false,
    val lat: Double? = null,
    val lng: Double? = null
) {
    fun toAddress(): Address {
        val calculatedSlug = slug ?: title?.lowercase()?.replace(" ", "-")?.replace("[^a-z0-9-]".toRegex(), "") ?: "unnamed"
        return Address(
            id = id ?: java.util.UUID.randomUUID().toString(),
            title = title ?: "",
            slug = calculatedSlug,
            status = status ?: "published",
            categorySlug = categorySlug ?: "palaces",
            destinationSlug = destinationSlug ?: "paris",
            shortDescription = shortDescription ?: "",
            editorialNote = editorialNote ?: "",
            featuredImage = featuredImage ?: "",
            gallery = gallery ?: emptyList(),
            address = address ?: "",
            phone = phone,
            email = email,
            websiteUrl = websiteUrl,
            reservationUrl = reservationUrl,
            instagramUrl = instagramUrl,
            openingHours = openingHours,
            priceLevel = priceLevel ?: "premium",
            editorRating = editorRating ?: 5.0,
            bestFor = bestFor ?: emptyList(),
            signatureExperience = signatureExperience ?: "",
            atmosphere = atmosphere ?: "",
            tags = tags ?: emptyList(),
            featured = featured ?: false,
            lat = lat,
            lng = lng,
            isFavorite = false
        )
    }
}
