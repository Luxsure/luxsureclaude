package com.example.widgets

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import com.example.ui.theme.Muted

@Composable
fun PriceBadge(
    level: String,
    modifier: Modifier = Modifier
) {
    val text = when (level.lowercase()) {
        "premium" -> "€€€"
        "luxury" -> "€€€€"
        "exceptional" -> "€€€€€"
        else -> level
    }

    Text(
        text = text,
        color = Muted,
        style = MaterialTheme.typography.bodySmall,
        modifier = modifier.testTag("price_badge")
    )
}
