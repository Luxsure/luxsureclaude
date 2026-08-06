package com.example.screens.categories

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.models.Category
import com.example.models.LuxsureViewModel
import com.example.ui.theme.Gold
import com.example.ui.theme.Ink
import com.example.ui.theme.Ivory
import com.example.ui.theme.Line
import com.example.ui.theme.Muted

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CategoriesScreen(
    viewModel: LuxsureViewModel,
    modifier: Modifier = Modifier,
    onCategorySelected: (String) -> Unit
) {
    val categories = viewModel.categories

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        CenterAlignedTopAppBar(
            title = {
                Text(
                    text = "UNIVERS ET STYLES",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurface,
                    letterSpacing = 2.sp
                )
            },
            colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                containerColor = MaterialTheme.colorScheme.background
            )
        )

        HorizontalDivider(color = Line, thickness = 0.5.dp)

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .testTag("categories_lazy_column"),
            contentPadding = PaddingValues(20.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            items(categories, key = { it.id }) { cat ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .clickable { onCategorySelected(cat.slug) }
                        .testTag("category_card_${cat.slug}"),
                    shape = RoundedCornerShape(4.dp),
                    elevation = CardDefaults.cardElevation(0.dp)
                ) {
                    Box(modifier = Modifier.fillMaxSize()) {
                        AsyncImage(
                            model = cat.image,
                            contentDescription = cat.name,
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )

                        // Elegant scrim overlay
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.verticalGradient(
                                        colors = listOf(Color.Transparent, Ink.copy(alpha = 0.85f)),
                                        startY = 100f
                                    )
                                )
                        )

                        // Info Column overlay
                        Column(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .padding(16.dp)
                        ) {
                            Text(
                                text = cat.name,
                                style = MaterialTheme.typography.headlineLarge.copy(fontSize = 22.sp),
                                color = Ivory
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = cat.description,
                                style = MaterialTheme.typography.bodySmall,
                                color = Ivory.copy(alpha = 0.8f),
                                maxLines = 2,
                                overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                            )
                        }
                    }
                }
            }
        }
    }
}
