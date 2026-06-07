package com.example.screens.addresses

import android.annotation.SuppressLint
import android.os.Handler
import android.os.Looper
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.models.Address

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun AddressMapView(
    addresses: List<Address>,
    modifier: Modifier = Modifier,
    onNavigateToAddressDetail: (String) -> Unit
) {
    val isDark = isSystemInDarkTheme()
    var savedWebView by remember { mutableStateOf<WebView?>(null) }

    // Prepare JSON manually and encode in Base64 for bulletproof data boundary passing
    val encodedData = remember(addresses) {
        val filtered = addresses.filter { it.lat != null && it.lng != null }
        val json = filtered.joinToString(
            prefix = "[",
            postfix = "]",
            separator = ","
        ) { addr ->
            """
            {
              "id": "${escapeJson(addr.id)}",
              "title": "${escapeJson(addr.title)}",
              "slug": "${escapeJson(addr.slug)}",
              "lat": ${addr.lat},
              "lng": ${addr.lng},
              "featuredImage": "${escapeJson(addr.featuredImage)}",
              "shortDescription": "${escapeJson(addr.shortDescription)}"
            }
            """.trimIndent()
        }
        Base64.encodeToString(json.toByteArray(Charsets.UTF_8), Base64.NO_WRAP)
    }

    // When encodedData or isDark changes, update the WebView markers
    LaunchedEffect(encodedData, savedWebView) {
        savedWebView?.let { webView ->
            webView.evaluateJavascript("javascript:updateMarkersBase64('$encodedData');") { }
        }
    }

    // Visual theme configurations based on whether the dark system theme is on
    val bgColor = if (isDark) "#171512" else "#FBFAF7"
    val tileUrl = if (isDark) {
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    } else {
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    }
    val borderColor = if (isDark) "#FBFAF7" else "#171512"
    val cardBgColor = if (isDark) "#171512" else "#FFFFFF"
    val textColor = if (isDark) "#FBFAF7" else "#171512"
    val lineColor = if (isDark) "#6B6259" else "#DED7CC"

    // Construct highly optimized self-contained HTML
    val htmlContent = remember(isDark) {
        """
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              background-color: $bgColor;
            }
            #map {
              height: 100%;
              width: 100%;
            }
            /* Custom minimalist popups to fit Luxsure design guidelines */
            .leaflet-popup-content-wrapper {
              background-color: $cardBgColor !important;
              color: $textColor !important;
              border-radius: 4px !important;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
              border: 0.5px solid $lineColor !important;
              padding: 0 !important;
            }
            .leaflet-popup-content {
              margin: 0 !important;
              padding: 12px !important;
              font-family: 'Helvetica Neue', Arial, sans-serif !important;
            }
            .leaflet-popup-tip {
              background-color: $cardBgColor !important;
              border: 0.5px solid $lineColor !important;
            }
            /* Remove standard leaflet credit line to maximize editorial feel */
            .leaflet-control-attribution {
              font-size: 8px !important;
              background-color: rgba(255,255,255,0.4) !important;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            // Initialize Leaflet Map centered on central Europe/France by default
            var map = L.map('map', {
              zoomControl: false,
              center: [48.8566, 2.3522],
              zoom: 5
            });

            // Add standard custom styled tiles
            L.tileLayer('$tileUrl', {
              maxZoom: 19
            }).addTo(map);

            // Layer group for easy marker lifecycle
            var markerGroup = L.layerGroup().addTo(map);

            // Create custom editorial dot marker
            var luxuryIcon = L.divIcon({
              className: 'custom-div-icon',
              html: "<div style='background-color:#B99046; width:16px; height:16px; border-radius:50%; border:2px solid $borderColor; box-shadow: 0px 2px 6px rgba(0,0,0,0.3);'></div>",
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });

            function updateMarkers(addresses) {
              markerGroup.clearLayers();
              if (!addresses || addresses.length === 0) return;

              var bounds = [];
              addresses.forEach(function(addr) {
                if (addr.lat && addr.lng) {
                  var marker = L.marker([addr.lat, addr.lng], { icon: luxuryIcon });
                  
                  var popupHtml = `
                    <div style="width:180px;">
                      <img src="${"$"}{addr.featuredImage}" style="width:100%; height:90px; object-fit:cover; border-radius:3px; background-color:#eaeaea;" />
                      <h4 style="margin:8px 0 2px 0; font-size:13px; color:$textColor; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${"$"}{addr.title}</h4>
                      <p style="margin:0 0 8px 0; font-size:11px; color:#958F85; line-height:1.3; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${"$"}{addr.shortDescription}</p>
                      <button onclick="Android.onAddressClick('${"$"}{addr.slug}')" style="width:100%; background-color:#B99046; color:#FBFAF7; border:none; padding:8px 0; font-size:10px; font-weight:bold; border-radius:3px; cursor:pointer; letter-spacing:1px; text-transform:uppercase;">Explorer</button>
                    </div>
                  `;

                  marker.bindPopup(popupHtml, {
                    closeButton: false,
                    offset: L.point(0, -2)
                  });

                  markerGroup.addLayer(marker);
                  bounds.push([addr.lat, addr.lng]);
                }
              });

              if (bounds.length > 0) {
                // Adjust viewport to fit all filtered elements perfectly 
                map.fitBounds(bounds, { padding: [40, 40] });
              }
            }

            // Core entrypoint triggered by Android webView.evaluateJavascript
            function updateMarkersBase64(b64Data) {
              try {
                var decoded = atob(b64Data);
                var utf8Decoded = decodeURIComponent(escape(decoded));
                var addresses = JSON.parse(utf8Decoded);
                updateMarkers(addresses);
              } catch (e) {
                console.error("Failed to decode coordinates:", e);
              }
            }
          </script>
        </body>
        </html>
        """.trimIndent()
    }

    // Render interactive WebView within Composable tree
    AndroidView(
        modifier = modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                settings.apply {
                  javaScriptEnabled = true
                  domStorageEnabled = true
                  loadWithOverviewMode = true
                  useWideViewPort = true
                }
                
                // Set background transparency to avoid brief white flashes during page composition
                setBackgroundColor(0x00000000)

                // Inject a javascript interface callback
                addJavascriptInterface(
                    object {
                        @JavascriptInterface
                        fun onAddressClick(slug: String) {
                            Handler(Looper.getMainLooper()).post {
                                onNavigateToAddressDetail(slug)
                            }
                        }
                    },
                    "Android"
                )

                webViewClient = object : WebViewClient() {
                    override fun onPageFinished(view: WebView?, url: String?) {
                        super.onPageFinished(view, url)
                        // Feed initial data immediately when page finishes composition
                        view?.evaluateJavascript("javascript:updateMarkersBase64('$encodedData');") { }
                    }
                }

                loadDataWithBaseURL(
                    "https://appassets.androidplatform.net",
                    htmlContent,
                    "text/html",
                    "UTF-8",
                    null
                )
                
                savedWebView = this
            }
        },
        update = { webView ->
            savedWebView = webView
        }
    )
}

private fun escapeJson(str: String): String {
    return str.replace("\\", "\\\\")
        .replace("\"", "\\\"")
        .replace("\n", "\\n")
        .replace("\r", "\\r")
        .replace("\t", "\\t")
}
