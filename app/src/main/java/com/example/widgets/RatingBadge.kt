package com.example.widgets

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.Gold

@Composable
fun RatingBadge(
    rating: Double,
    modifier: Modifier = Modifier,
    compact: Boolean = false
) {
    if (compact) {
        Row(
            modifier = modifier
                .border(width = 0.5.dp, color = Gold.copy(alpha = 0.4f), shape = RoundedCornerShape(2.dp))
                .padding(horizontal = 6.dp, vertical = 2.dp)
                .testTag("rating_badge_compact"),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = String.format("%.1f", rating),
                color = Gold,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium
            )
        }
    } else {
        Row(
            modifier = modifier.testTag("rating_badge_extended"),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Filled.Star,
                contentDescription = "Évaluation",
                tint = Gold,
                modifier = Modifier.size(14.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = String.format("%.1f", rating),
                color = Gold,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
