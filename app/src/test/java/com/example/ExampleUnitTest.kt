package com.example

import org.junit.Assert.*
import org.junit.Test
import java.net.HttpURLConnection
import java.net.URL
import java.io.BufferedReader
import java.io.InputStreamReader

class ExampleUnitTest {
  @Test
  fun addition_isCorrect() {
    assertEquals(4, 2 + 2)
  }

  @Test
  fun probeSupabaseTables() {
    val urlStr = "https://oqxalpwnyvuhkimjrxhl.supabase.co/rest/v1/"
    val apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xeGFscHdueXZ1aGtpbWpycnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTgyNzgsImV4cCI6MjA5NTg5NDI3OH0.OUiVXSLhOaokHO3wrHOn0o5RXhpp3uZvgPy-ptdIakc"
    
    val url = URL(urlStr)
    val conn = url.openConnection() as HttpURLConnection
    conn.requestMethod = "GET"
    conn.setRequestProperty("apikey", apiKey)
    conn.setRequestProperty("Authorization", "Bearer $apiKey")
    
    val responseCode = conn.responseCode
    val responseStream = if (responseCode in 200..299) conn.inputStream else conn.errorStream
    val reader = BufferedReader(InputStreamReader(responseStream))
    val responseText = reader.use { it.readText() }
    
    // Fail containing the result so it is printed in console output
    throw RuntimeException("RESPONSE_CODE: $responseCode\nRESPONSE: $responseText")
  }
}

