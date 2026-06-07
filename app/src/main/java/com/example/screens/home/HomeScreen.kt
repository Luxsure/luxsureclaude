package com.example.screens.home

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.example.models.Address
import com.example.models.Category
import com.example.models.Destination
import com.example.models.LuxsureViewModel
import com.example.ui.theme.Gold
import com.example.ui.theme.Ink
import com.example.ui.theme.Ivory
import com.example.ui.theme.Line
import com.example.ui.theme.Muted
import com.example.widgets.AddressCard
import com.example.models.SyncResult
import com.example.widgets.SectionHeader

@Composable
fun HomeScreen(
    viewModel: LuxsureViewModel,
    modifier: Modifier = Modifier,
    onNavigateToAddresses: (String?, String?, String?) -> Unit, // query, category, destination
    onNavigateToAddressDetail: (String) -> Unit
) {
    val addresses by viewModel.rawAddresses.collectAsState()
    val categories = viewModel.categories
    val destinations = viewModel.destinations
    val syncResult by viewModel.syncResult.collectAsState()

    val featuredAddresses = addresses.filter { it.featured }.take(6)

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .background(MaterialTheme.colorScheme.background)
    ) {
        // ── SUPABASE SYNC STATUS ACCORDION ────────────────────────────────
        SupabaseSyncStatusBanner(
            syncResult = syncResult,
            onTriggerSync = { viewModel.refreshContent() }
        )

        // ── HERO SECTION ──────────────────────────────────────────────────
        HeroSection(
            onQuickTagClick = { tag -> onNavigateToAddresses(tag, null, null) },
            onSearchBarClick = { onNavigateToAddresses(null, null, null) }
        )

        // ── ADRESSES DU MOMENT (FEATURED) ──────────────────────────────────
        SectionHeader(
            eyebrow = "Regard Éditorial",
            title = "Adresses du moment",
            ctaLabel = "Toutes",
            onCta = { onNavigateToAddresses(null, null, null) }
        )

        if (featuredAddresses.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = Gold, modifier = Modifier.size(24.dp))
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                featuredAddresses.forEach { address ->
                    val cat = categories.find { it.slug == address.categorySlug }
                    val dest = destinations.find { it.slug == address.destinationSlug }
                    AddressCard(
                        address = address,
                        categoryName = cat?.name,
                        destinationName = dest?.name,
                        onCardClick = { onNavigateToAddressDetail(it.slug) },
                        onFavoriteToggle = { viewModel.toggleFavorite(it) }
                    )
                }
            }
        }

        // ── CATÉGORIES (EXPLORER PAR UNIVERS) ────────────────────────────────
        SectionHeader(
            eyebrow = "Catégories",
            title = "Explorer par univers",
            ctaLabel = "Voir tout",
            onCta = { onNavigateToAddresses(null, null, null) }
        )

        CategoriesGrid(
            categories = categories,
            onCategoryClick = { slug -> onNavigateToAddresses(null, slug, null) }
        )

        // ── DESTINATIONS (CARNET DE VOYAGE) ──────────────────────────────────
        SectionHeader(
            eyebrow = "Destinations",
            title = "Carnet de voyage",
            ctaLabel = "Explorer",
            onCta = { onNavigateToAddresses(null, null, null) }
        )

        DestinationsRow(
            destinations = destinations,
            onDestinationClick = { slug -> onNavigateToAddresses(null, null, slug) }
        )

        // ── PAR OCCASION ──────────────────────────────────────────────────
        SectionHeader(
            eyebrow = "Par occasion",
            title = "Pour quel moment ?"
        )

        OccasionsGrid(
            onOccasionClick = { searchTag -> onNavigateToAddresses(searchTag, null, null) }
        )

        Spacer(modifier = Modifier.height(40.dp))
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun HeroSection(
    onQuickTagClick: (String) -> Unit,
    onSearchBarClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(500.dp)
            .testTag("hero_section")
    ) {
        // High Definition Luxury Image
        AsyncImage(
            model = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
            contentDescription = "Luxsure Hero",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // Multi-layered elegant shadow overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Ink.copy(alpha = 0.4f),
                            Ink.copy(alpha = 0.65f),
                            Ink
                        ),
                        startY = 0f
                    )
                )
        )

        // Hero Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(start = 20.dp, end = 20.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.Bottom
        ) {
            Text(
                text = "ÉDITION 2026",
                style = MaterialTheme.typography.labelSmall,
                color = Gold,
                modifier = Modifier.testTag("hero_edition_tag")
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "Pas un ranking.",
                style = MaterialTheme.typography.displayLarge.copy(fontSize = 38.sp),
                color = Ivory
            )
            Text(
                text = "Un point de vue.",
                style = MaterialTheme.typography.displayLarge.copy(
                    fontSize = 38.sp,
                    fontStyle = FontStyle.Italic
                ),
                color = Ivory.copy(alpha = 0.85f)
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "Restaurants d'auteur, palaces de légende, maisons de haute joaillerie — une sélection éditoriale construite sur dix-huit ans de terrain par Luxsure Group.",
                style = MaterialTheme.typography.bodyMedium,
                color = Ivory.copy(alpha = 0.72f),
                lineHeight = 22.sp
            )
            Spacer(modifier = Modifier.height(20.dp))

            // Embedded search bar proxy
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(Ivory.copy(alpha = 0.12f))
                    .border(width = 1.dp, color = Ivory.copy(alpha = 0.25f), shape = RoundedCornerShape(4.dp))
                    .clickable { onSearchBarClick() }
                    .padding(horizontal = 14.dp)
                    .testTag("hero_search_proxy"),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Filled.Search,
                    contentDescription = null,
                    tint = Ivory.copy(alpha = 0.6f),
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "Rechercher une adresse, un univers...",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Ivory.copy(alpha = 0.6f)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Quick Filters
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("Paris", "Tokyo", "Londres", "Palaces", "Gastronomie").forEach { tag ->
                    Box(
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(Color.Transparent)
                            .border(width = 0.5.dp, color = Ivory.copy(alpha = 0.25f), shape = CircleShape)
                            .clickable { onQuickTagClick(tag) }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                            .testTag("hero_quick_tag_$tag")
                    ) {
                        Text(
                            text = tag,
                            style = MaterialTheme.typography.bodySmall,
                            color = Ivory.copy(alpha = 0.8f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CategoriesGrid(
    categories: List<Category>,
    onCategoryClick: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp),
        verticalArrangement = Arrangement.spacedBy(1.dp) // Fine line separators
    ) {
        // Render in pairs
        categories.chunked(2).forEach { rowItems ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(1.dp)
            ) {
                rowItems.forEach { cat ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .aspectRatio(1.1f)
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                            .clickable { onCategoryClick(cat.slug) }
                            .testTag("category_tile_${cat.slug}")
                    ) {
                        AsyncImage(
                            model = cat.image,
                            contentDescription = cat.name,
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )
                        // Dark delicate vignette
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.verticalGradient(
                                        colors = listOf(Color.Transparent, Ink.copy(alpha = 0.8f)),
                                        startY = 100f
                                    )
                                )
                        )
                        Text(
                            text = cat.name,
                            style = MaterialTheme.typography.headlineMedium.copy(fontSize = 15.sp),
                            color = Ivory,
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .padding(12.dp),
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
                if (rowItems.size < 2) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
private fun DestinationsRow(
    destinations: List<Destination>,
    onDestinationClick: (String) -> Unit
) {
    LazyRow(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("destinations_row"),
        contentPadding = PaddingValues(horizontal = 20.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(destinations, key = { it.id }) { dest ->
            Column(
                modifier = Modifier
                    .width(130.dp)
                    .clickable { onDestinationClick(dest.slug) }
                    .testTag("destination_card_${dest.slug}")
            ) {
                Box(
                    modifier = Modifier
                        .width(130.dp)
                        .aspectRatio(3f / 4f)
                        .clip(RoundedCornerShape(4.dp))
                ) {
                    AsyncImage(
                        model = dest.image,
                        contentDescription = dest.name,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = dest.name,
                    style = MaterialTheme.typography.headlineMedium.copy(fontSize = 16.sp),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = dest.country,
                    style = MaterialTheme.typography.bodySmall,
                    color = Muted,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

private val OccasionsList = listOf(
    Pair("Une table d'auteur d'exception", "Gastronomie et Étoilé"),
    Pair("Deux jours à ne rien devoir à personne", "Palace de légende"),
    Pair("La panthère et l'éclat de la place Vendôme", "Joaillerie et Couture"),
    Pair("S'absenter quelques heures pour renaître", "Spa et Soin"),
    Pair("Recevoir et marquer les mémoires", "Affaires et Chic"),
    Pair("Offrir le sur-mesure impérissable", "Cadeau d'art")
)

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun OccasionsGrid(
    onOccasionClick: (String) -> Unit
) {
    FlowRow(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        maxItemsInEachRow = 2
    ) {
        OccasionsList.forEach { (label, searchTag) ->
            Box(
                modifier = Modifier
                    .weight(1f)
                    .aspectRatio(1.5f)
                    .clip(RoundedCornerShape(4.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .border(width = 0.5.dp, color = Line, shape = RoundedCornerShape(4.dp))
                    .clickable { onOccasionClick(searchTag) }
                    .padding(16.dp)
                    .testTag("occasion_tile_${searchTag.replace(" ", "_").lowercase()}")
            ) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = label,
                        style = MaterialTheme.typography.headlineMedium.copy(fontSize = 16.sp, lineHeight = 20.sp),
                        color = MaterialTheme.colorScheme.onSurface,
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = "Découvrir →",
                        style = MaterialTheme.typography.bodySmall,
                        color = Muted
                    )
                }
            }
        }
    }
}

@Composable
private fun SupabaseSyncStatusBanner(
    syncResult: com.example.models.SyncResult,
    onTriggerSync: () -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Surface(
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { expanded = !expanded }
            .testTag("supabase_sync_banner")
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 10.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    val statusDotColor = when (syncResult) {
                        is SyncResult.Syncing -> Gold
                        is SyncResult.Success -> Color(0xFF4CAF50)
                        is SyncResult.Error -> Color(0xFFF44336)
                        is SyncResult.NotConfigured -> Muted
                        else -> Gold.copy(alpha = 0.6f)
                    }

                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(statusDotColor)
                    )

                    val statusTitle = when (syncResult) {
                        is SyncResult.Idle -> "Luxsure Direct • Synchronisé"
                        is SyncResult.Syncing -> "Mise à jour du Guide..."
                        is SyncResult.Success -> "Guide Synchronisé • ${syncResult.count} Adresses"
                        is SyncResult.Error -> "Mode Local Activé (Erreur de Sync)"
                        is SyncResult.NotConfigured -> "Mode Local Actif (Pas de Supabase)"
                    }

                    Text(
                        text = statusTitle.uppercase(),
                        style = MaterialTheme.typography.labelSmall.copy(
                            letterSpacing = 1.2.sp,
                            fontSize = 10.sp
                        ),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (syncResult is SyncResult.Syncing) {
                        CircularProgressIndicator(
                            color = Gold,
                            strokeWidth = 1.5.dp,
                            modifier = Modifier.size(12.dp)
                        )
                    } else {
                        Text(
                            text = if (expanded) "MASQUER DET." else "DÉTAILS SYNC",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = Gold,
                                letterSpacing = 1.sp,
                                fontSize = 9.sp
                            )
                        )
                    }
                }
            }

            if (expanded) {
                Spacer(modifier = Modifier.height(8.dp))
                HorizontalDivider(color = Line.copy(alpha = 0.3f), thickness = 0.5.dp)
                Spacer(modifier = Modifier.height(8.dp))

                val detailedMessage = when (syncResult) {
                    is SyncResult.Idle -> 
                        "Le guide utilise les données stockées localement. Tirez vers le bas ou cliquez sur synchroniser pour importer depuis Supabase."
                    is SyncResult.Syncing -> 
                        "Récupération des adresses de l'édition 2026 depuis Postgrest Supabase en arrière-plan..."
                    is SyncResult.Success -> 
                        "La synchronisation a réussi ! Le guide a importé et mis à jour ${syncResult.count} adresses sans écraser vos favoris."
                    is SyncResult.Error -> 
                        "Une erreur est survenue lors du rafraîchissement :\n${syncResult.message}\n\nAssurez-vous que votre projet Supabase est actif et que vos clés d'API configurées dans AI Studio sont valides."
                    is SyncResult.NotConfigured -> 
                        "Les variables SUPABASE_URL et SUPABASE_ANON_KEY ne sont pas renseignées dans les secrets de l'application.\n\n" +
                        "Afin de connecter votre base de données en ligne, veuillez entrer vos secrets dans le panneau Secrets de Google AI Studio puis compilez à nouveau."
                }

                Text(
                    text = detailedMessage,
                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp, lineHeight = 16.sp),
                    color = Muted
                )

                if (syncResult !is SyncResult.Syncing) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Button(
                        onClick = onTriggerSync,
                        colors = ButtonDefaults.buttonColors(containerColor = Ink),
                        shape = RoundedCornerShape(2.dp),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                        modifier = Modifier
                            .height(28.dp)
                            .testTag("trigger_sync_button")
                    ) {
                        Text(
                            text = "FORCE-SYNC AVEC SUPABASE",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = Ivory,
                                fontSize = 9.sp,
                                letterSpacing = 1.sp
                            )
                        )
                    }
                }
            }
        }
    }
}
