package com.example.screens.addresses

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Place
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.models.Address
import com.example.ui.theme.Gold
import com.example.ui.theme.Ink
import com.example.ui.theme.Line
import com.example.ui.theme.Muted

@Composable
fun AddressMapView(
    addresses: List<Address>,
    onNavigateToAddressDetail: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .testTag("address_map_view_list"),
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(0.dp)
    ) {
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(4.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .border(0.5.dp, Line, RoundedCornerShape(4.dp))
                    .padding(20.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Filled.Place,
                        contentDescription = null,
                        tint = Gold,
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "VUE CARTE",
                        style = MaterialTheme.typography.labelSmall,
                        color = Gold,
                        letterSpacing = 2.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${addresses.size} adresses géolocalisées",
                        style = MaterialTheme.typography.bodySmall,
                        color = Muted
                    )
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        items(addresses, key = { it.id }) { address ->
            Column {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigateToAddressDetail(address.slug) }
                        .padding(vertical = 14.dp)
                        .testTag("map_pin_${address.slug}"),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(Ink),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Place,
                            contentDescription = null,
                            tint = Gold,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = address.title,
                            style = MaterialTheme.typography.headlineMedium.copy(fontSize = 14.sp),
                            color = MaterialTheme.colorScheme.onSurface,
                            maxLines = 1
                        )
                        Text(
                            text = address.address,
                            style = MaterialTheme.typography.bodySmall,
                            color = Muted,
                            maxLines = 1
                        )
                    }
                    if (address.lat != null && address.lng != null) {
                        Text(
                            text = "%.4f, %.4f".format(address.lat, address.lng),
                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 9.sp),
                            color = Muted
                        )
                    }
                }
                HorizontalDivider(color = Line, thickness = 0.5.dp)
            }
        }
    }
}
