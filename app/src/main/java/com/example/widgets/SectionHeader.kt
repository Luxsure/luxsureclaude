package com.example.widgets

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.height
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.example.ui.theme.Muted

@Composable
fun SectionHeader(
    eyebrow: String,
    title: String,
    modifier: Modifier = Modifier,
    ctaLabel: String? = null,
    onCta: (() -> Unit)? = null
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(start = 20.dp, end = 20.dp, top = 32.dp, bottom = 16.dp)
            .testTag("section_header"),
        verticalAlignment = Alignment.Bottom
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = eyebrow.uppercase(),
                style = MaterialTheme.typography.labelSmall,
                color = Muted
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.headlineMedium
            )
        }

        if (ctaLabel != null && onCta != null) {
            Text(
                text = "$ctaLabel →",
                style = MaterialTheme.typography.bodySmall,
                color = Muted,
                modifier = Modifier
                    .clickable(onClick = onCta)
                    .padding(vertical = 4.dp)
                    .testTag("section_header_cta")
            )
        }
    }
}
