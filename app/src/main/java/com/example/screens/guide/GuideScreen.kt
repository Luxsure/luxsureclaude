package com.example.screens.guide

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ui.theme.Gold
import com.example.ui.theme.Ink
import com.example.ui.theme.Ivory
import com.example.ui.theme.Line
import com.example.ui.theme.Muted
import com.example.ui.theme.SecondaryBg

@Composable
fun GuideScreen(
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(20.dp)
            .testTag("guide_screen"),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(24.dp))

        // Large Editorial Banner
        Text(
            text = "LE GUIDE LUXSURE",
            style = MaterialTheme.typography.labelSmall,
            color = Gold,
            letterSpacing = 3.sp
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = "L'Art Suprême de la Sélection",
            style = MaterialTheme.typography.displayMedium,
            color = MaterialTheme.colorScheme.onSurface,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Fine separator line
        HorizontalDivider(color = Line, thickness = 0.5.dp, modifier = Modifier.width(80.dp))

        Spacer(modifier = Modifier.height(24.dp))

        // High resolution visual representation of an elegant room or library
        AsyncImage(
            model = "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
            contentDescription = "Bibliothèque de luxe",
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .clip(RoundedCornerShape(4.dp))
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Main editorial statement
        Text(
            text = "Fondé en 2008, Luxsure Group s'est imposé comme une voix singulière dans le paysage du luxe contemporain. Notre philosophie s'articule autour d'une conviction cardinale : la véritable excellence ne se mesure pas par des notations mathématiques ou des algorithmes complexes, mais par l'émotion pure, le geste d'art et la rigueur du terrain.",
            style = MaterialTheme.typography.bodyLarge.copy(fontSize = 15.sp),
            lineHeight = 24.sp,
            color = MaterialTheme.colorScheme.onSurface,
            textAlign = TextAlign.Justify
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Quote Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(SecondaryBg, shape = RoundedCornerShape(2.dp))
                .border(width = 0.5.dp, color = Line, shape = RoundedCornerShape(2.dp))
                .padding(20.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "« Un palace, un restaurant ou une manufacture n'a pas seulement besoin d'être grand ou fastueux pour figurer dans nos pages. Il doit posséder une âme, une signature inimitable, et l'art souverain d'arrêter le temps. »",
                    style = MaterialTheme.typography.displayMedium.copy(
                        fontSize = 17.sp,
                        lineHeight = 24.sp,
                        fontStyle = FontStyle.Italic
                    ),
                    color = Ink,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "— Pascal Iakovou, Fondateur de Luxsure",
                    style = MaterialTheme.typography.labelSmall,
                    color = Gold,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // The Charter details
        Text(
            text = "NOS QUATRE TOKENS DE SÉLECTION",
            style = MaterialTheme.typography.labelSmall,
            color = Gold,
            letterSpacing = 2.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        CharterItem(
            num = "01",
            title = "L'authenticité historique",
            desc = "Chaque adresse doit s'inscrire dans une continuité temporelle, être porteuse d'un héritage solide ou d'une vision d'auteur indéfectible."
        )

        CharterItem(
            num = "02",
            title = "La singularité sensorielle",
            desc = "Nous privilégions les havres confidentiels proposant d'authentiques dépaysements et des rituels inaccessibles ailleurs."
        )

        CharterItem(
            num = "03",
            title = "La discrétion du service",
            desc = "Un service palace exceptionnel anticipe les désirs sans jamais être intrusif, établissant une relation d'intimité royale absolue."
        )

        CharterItem(
            num = "04",
            title = "L'excellence artisanale",
            desc = "De la coupe parfaite d'un diamant au modelage millimétré d'un plat triplement étoilé, seule la perfection d'art prévaut."
        )

        Spacer(modifier = Modifier.height(40.dp))
    }
}

@Composable
private fun CharterItem(
    num: String,
    title: String,
    desc: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.Top
    ) {
        Text(
            text = num,
            style = MaterialTheme.typography.displayLarge.copy(fontSize = 24.sp),
            color = Gold,
            modifier = Modifier.width(48.dp)
        )

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge.copy(fontSize = 16.sp),
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = desc,
                style = MaterialTheme.typography.bodyMedium,
                color = Muted,
                lineHeight = 18.sp
            )
        }
    }
}
