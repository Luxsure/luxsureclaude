package com.example.widgets

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.models.Address
import com.example.ui.theme.Line
import com.example.ui.theme.Muted
import com.example.ui.theme.Gold

@Composable
fun AddressCard(
    address: Address,
    modifier: Modifier = Modifier,
    categoryName: String? = null,
    destinationName: String? = null,
    onCardClick: (Address) -> Unit,
    onFavoriteToggle: ((Address) -> Unit)? = null
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("address_card_${address.slug}"),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.background),
        elevation = CardDefaults.cardElevation(0.dp)
    ) {
        Column(
            modifier = Modifier
                .clickable { onCardClick(address) }
                .padding(vertical = 12.dp)
        ) {
            // Image with 4:3 Aspect Ratio and favorite overlay option
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(4f / 3f)
                    .clip(RoundedCornerShape(4.dp))
            ) {
                if (address.featuredImage.isNotEmpty()) {
                    AsyncImage(
                        model = address.featuredImage,
                        contentDescription = "Photo de ${address.title}",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .testTag("empty_image_placeholder"),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "VISUEL À VENIR",
                            style = MaterialTheme.typography.labelSmall,
                            color = Muted
                        )
                    }
                }

                // Favorite button heart overlay
                if (onFavoriteToggle != null) {
                    IconButton(
                        onClick = { onFavoriteToggle(address) },
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(8.dp)
                            .testTag("address_favorite_button_${address.slug}")
                    ) {
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = Color.Black.copy(alpha = 0.4f),
                            modifier = Modifier.size(36.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = if (address.isFavorite) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                                    contentDescription = "Favori",
                                    tint = if (address.isFavorite) Color.Red else Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Metadata row (Eyebrow & rating)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                val tagsToShow = listOfNotNull(categoryName, destinationName)
                val eyebrowText = if (tagsToShow.isEmpty()) {
                    address.categorySlug.uppercase()
                } else {
                    tagsToShow.joinToString(" · ").uppercase()
                }

                Text(
                    text = eyebrowText,
                    style = MaterialTheme.typography.labelSmall,
                    color = Muted,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )

                if (address.editorRating > 0) {
                    RatingBadge(rating = address.editorRating, compact = true)
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Title
            Text(
                text = address.title,
                style = MaterialTheme.typography.headlineMedium,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            if (address.shortDescription.isNotEmpty()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = address.shortDescription,
                    style = MaterialTheme.typography.bodyMedium,
                    color = Muted,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Price / Purpose row
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                PriceBadge(level = address.priceLevel)
                if (address.bestFor.isNotEmpty()) {
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = "·", color = Line)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Idéal pour ${address.bestFor.first()}",
                        style = MaterialTheme.typography.bodySmall,
                        color = Muted,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}
