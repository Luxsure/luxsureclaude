package com.example.screens.addresses

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import android.annotation.SuppressLint
import android.webkit.WebView
import android.webkit.WebViewClient
import coil.compose.AsyncImage
import com.example.models.Address
import com.example.models.LuxsureViewModel
import com.example.ui.theme.DeepGreen
import com.example.ui.theme.Gold
import com.example.ui.theme.Ink
import com.example.ui.theme.Ivory
import com.example.ui.theme.Line
import com.example.ui.theme.Muted
import com.example.ui.theme.SecondaryBg
import com.example.widgets.PriceBadge
import com.example.widgets.RatingBadge

@SuppressLint("SetJavaScriptEnabled")
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AddressDetailScreen(
    viewModel: LuxsureViewModel,
    slug: String,
    modifier: Modifier = Modifier,
    onNavigateBack: () -> Unit
) {
    val addressState by viewModel.getAddressBySlug(slug).collectAsState()
    val uriHandler = LocalUriHandler.current

    val address = addressState
    if (address == null) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator(color = Gold)
        }
        return
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .testTag("address_detail_screen_$slug")
    ) {
        // ── TOP FLOATING HERO IMAGE & ACTIONS ─────────────────────────────
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(320.dp)
        ) {
            if (address.featuredImage.isNotEmpty()) {
                AsyncImage(
                    model = address.featuredImage,
                    contentDescription = address.title,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Ink),
                    contentAlignment = Alignment.Center
                ) {
                    Text("LUXSURE GUIDE", style = MaterialTheme.typography.labelSmall, color = Gold)
                }
            }

            // Dark subtle top gradient overlay for action buttons readability
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(80.dp)
                    .background(
                        androidx.compose.ui.graphics.Brush.verticalGradient(
                            colors = listOf(Color.Black.copy(alpha = 0.5f), Color.Transparent)
                        )
                    )
            )

            // Dynamic Action Buttons
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Back Button
                IconButton(
                    onClick = onNavigateBack,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color.Black.copy(alpha = 0.4f))
                        .testTag("detail_back_button")
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Retour",
                        tint = Ivory,
                        modifier = Modifier.size(20.dp)
                    )
                }

                // Bookmark Fav Button
                IconButton(
                    onClick = { viewModel.toggleFavorite(address) },
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color.Black.copy(alpha = 0.4f))
                        .testTag("detail_favorite_button")
                ) {
                    Icon(
                        imageVector = if (address.isFavorite) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                        contentDescription = "Favori",
                        tint = if (address.isFavorite) Color.Red else Ivory,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }

        // ── CONTENT CONTAINER ─────────────────────────────────────────────
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            // Eyebrow & Rating Score
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                val cat = viewModel.categories.find { it.slug == address.categorySlug }
                Text(
                    text = (cat?.name ?: address.categorySlug).uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    color = Muted
                )

                if (address.editorRating > 0) {
                    RatingBadge(rating = address.editorRating)
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Main Title
            Text(
                text = address.title,
                style = MaterialTheme.typography.displayMedium,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Price / Best Recommendation Row
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                PriceBadge(level = address.priceLevel)
                if (address.bestFor.isNotEmpty()) {
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(text = "·", color = Line)
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = address.bestFor.first(),
                        style = MaterialTheme.typography.bodySmall,
                        color = Muted
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
            HorizontalDivider(color = Line, thickness = 0.5.dp)
            Spacer(modifier = Modifier.height(20.dp))

            // Editorial short summary text
            Text(
                text = address.shortDescription,
                style = MaterialTheme.typography.bodyLarge,
                lineHeight = 24.sp,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Note de la Rédaction (HIGHLIGHT BOX with custom side border styling)
            if (address.editorialNote.isNotEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(SecondaryBg, shape = RoundedCornerShape(2.dp))
                        .border(
                            width = 0.5.dp,
                            color = Line,
                            shape = RoundedCornerShape(2.dp)
                        )
                        .testTag("editorial_note_card")
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        // Golden vertical ribbon line
                        Box(
                            modifier = Modifier
                                .width(3.dp)
                                .fillMaxHeight()
                                .height(IntrinsicSize.Max)
                                .align(Alignment.CenterVertically)
                                .background(Gold)
                        )

                        Column(
                            modifier = Modifier
                                .padding(16.dp)
                                .weight(1f)
                        ) {
                            Text(
                                text = "NOTE DE LA RÉDACTION",
                                style = MaterialTheme.typography.labelSmall,
                                color = Gold,
                                fontWeight = FontWeight.SemiBold
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = address.editorialNote,
                                style = MaterialTheme.typography.displayMedium.copy(
                                    fontSize = 16.sp,
                                    lineHeight = 22.sp,
                                    fontStyle = FontStyle.Italic
                                ),
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(24.dp))
            }

            // Context Details Grid list
            if (address.signatureExperience.isNotEmpty()) {
                InfoItem(label = "Expérience Signature", value = address.signatureExperience)
            }
            if (address.atmosphere.isNotEmpty()) {
                InfoItem(label = "Atmosphère", value = address.atmosphere)
            }
            address.openingHours?.let {
                InfoItem(label = "Horaires d'ouverture", value = it)
            }
            if (address.address.isNotEmpty()) {
                InfoItem(label = "Adresse physique", value = address.address)
            }
            address.phone?.let {
                InfoItem(label = "Téléphone de contact", value = it)
            }
            address.email?.let {
                InfoItem(label = "Courrier électronique", value = it)
            }

            Spacer(modifier = Modifier.height(24.dp))

            // ── GOOGLE MAPS & STREET VIEW VISUAL EXPLORER ──────────────────────
            Text(
                text = "APERÇU GOOGLE MAPS & STREET VIEW",
                style = MaterialTheme.typography.labelSmall,
                color = Muted,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
            
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .border(width = 0.5.dp, color = Line, shape = RoundedCornerShape(4.dp))
                    .testTag("google_maps_visual_card"),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Box(modifier = Modifier.fillMaxSize()) {
                    val locationQuery = if (address.lat != null && address.lng != null) {
                        "${address.lat},${address.lng}"
                    } else {
                        "${address.title}, ${address.address}"
                    }
                    val encodedQuery = remember(locationQuery) {
                        try {
                            java.net.URLEncoder.encode(locationQuery, "UTF-8")
                        } catch (e: Exception) {
                            locationQuery
                        }
                    }
                    val embedUrl = "https://www.google.com/maps?q=$encodedQuery&output=embed"

                    AndroidView(
                        modifier = Modifier.fillMaxSize(),
                        factory = { context ->
                            WebView(context).apply {
                                settings.apply {
                                    javaScriptEnabled = true
                                    domStorageEnabled = true
                                    loadWithOverviewMode = true
                                    useWideViewPort = true
                                }
                                setBackgroundColor(0x00000000)
                                webViewClient = WebViewClient()
                                loadUrl(embedUrl)
                            }
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            val mapIntentUrl = if (address.lat != null && address.lng != null) {
                "geo:${address.lat},${address.lng}?q=${try { java.net.URLEncoder.encode(address.address, "UTF-8") } catch (e: Exception) { "" }}"
            } else {
                "geo:0,0?q=${try { java.net.URLEncoder.encode(address.address, "UTF-8") } catch (e: Exception) { "" }}"
            }
            val webMapUrl = "https://www.google.com/maps/search/?api=1&query=${try { java.net.URLEncoder.encode(address.title + ", " + address.address, "UTF-8") } catch (e: Exception) { "" }}"

            OutlinedButton(
                onClick = {
                    try {
                        uriHandler.openUri(mapIntentUrl)
                    } catch (e: Exception) {
                        uriHandler.openUri(webMapUrl)
                    }
                },
                shape = RoundedCornerShape(4.dp),
                border = BorderStroke(0.5.dp, Line),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Gold),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(40.dp)
                    .testTag("open_external_google_maps_button")
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Filled.Place,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = Gold
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "EXPLORER DANS GOOGLE MAPS",
                        style = MaterialTheme.typography.labelSmall,
                        letterSpacing = 1.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Horizontal Tags list
            if (address.tags.isNotEmpty()) {
                FlowRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    address.tags.forEach { tag ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                .border(width = 0.5.dp, color = Line, shape = RoundedCornerShape(20.dp))
                                .padding(horizontal = 12.dp, vertical = 5.dp)
                        ) {
                            Text(
                                text = tag,
                                style = MaterialTheme.typography.bodySmall,
                                color = Muted
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(24.dp))
            }

            // Reservation & Website buttons
            address.reservationUrl?.let { url ->
                Button(
                    onClick = { uriHandler.openUri(url) },
                    shape = RoundedCornerShape(4.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = DeepGreen),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("booking_button")
                ) {
                    Text(
                        text = "Réserver l'expérience d'exception",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                        color = Ivory
                    )
                }
                Spacer(modifier = Modifier.height(10.dp))
            }

            address.websiteUrl?.let { url ->
                OutlinedButton(
                    onClick = { uriHandler.openUri(url) },
                    shape = RoundedCornerShape(4.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Ink),
                    border = BorderStroke(0.5.dp, Line),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("website_button")
                ) {
                    Text(
                        text = "Visiter le site officiel",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                    )
                }
            }
        }

        // ── ATTACHED GALLERY ──────────────────────────────────────────────
        if (address.gallery.isNotEmpty()) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "PORTFOLIO VISUEL",
                style = MaterialTheme.typography.labelSmall,
                color = Muted,
                modifier = Modifier.padding(start = 20.dp, end = 20.dp, bottom = 10.dp)
            )

            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("portfolio_gallery"),
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(address.gallery) { imageUrl ->
                    AsyncImage(
                        model = imageUrl,
                        contentDescription = "Galerie",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .width(240.dp)
                            .height(180.dp)
                            .clip(RoundedCornerShape(4.dp))
                    )
                }
            }
            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}

@Composable
private fun InfoItem(
    label: String,
    value: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp)
            .testTag("info_row_${label.lowercase().replace(" ", "_")}"),
        verticalAlignment = Alignment.Top
    ) {
        Text(
            text = label.uppercase(),
            style = MaterialTheme.typography.labelSmall,
            color = Muted,
            modifier = Modifier.width(130.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface,
            lineHeight = 20.sp,
            modifier = Modifier.weight(1f)
        )
    }
}
