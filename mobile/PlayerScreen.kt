package com.surverse.music.ui.player

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Premium Music Player Screen
 * Designed with a strict mobile-first approach.
 * Focuses on immersion, typography, and thumb-friendly controls.
 */
@Composable
fun PlayerScreen(
    songTitle: String,
    artistName: String,
    albumArtUrl: String, // Assume loading via coil/glide in real impl
    currentTime: Float,
    duration: Float,
    isPlaying: Boolean,
    onPlayPause: () -> Unit,
    onNext: () -> Unit,
    onPrevious: () -> Unit,
    onSeek: (Float) -> Unit,
    isFavorite: Boolean,
    onFavoriteClick: () -> Unit
) {
    // Designer Note: Using a deep dark background derived from a neutral stone/obsidian palette
    // In a production app, the background would be a subtle gradient derived from the artwork color
    val backgroundColor = Color(0xFF0A0A0A)
    val accentColor = Color(0xFFFFFFFF) // Clean white accent as the primary focus
    val mutedTextColor = Color(0xFF8E8E93)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(backgroundColor)
            .windowInsetsPadding(WindowInsets.systemBars)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            // --- SECTION 1: IMMERSIVE ART AREA ---
            // Designed to dominate the viewport and set the mood.
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(500.dp) // Covers ~60-70% of phone screen height
                    .clip(RoundedCornerShape(topStart = 0.dp, topEnd = 0.dp, bottomStart = 32.dp, bottomEnd = 32.dp))
            ) {
                // Placeholder for Album Art
                // Image(painter = ..., contentDescription = null, contentScale = ContentScale.Crop)
                Box(modifier = Modifier.fillMaxSize().background(Color.DarkGray)) // Mock for image

                // Subtle Dark Gradient Overlay at the bottom for readability transition
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(Color.Transparent, backgroundColor.copy(alpha = 0.6f)),
                                startY = 400f
                            )
                        )
                )

                // Header Action: Close/Dismiss
                IconButton(
                    onClick = { /* Dismiss logic */ },
                    modifier = Modifier.padding(16.dp).align(Alignment.TopStart)
                ) {
                    Icon(Icons.Rounded.KeyboardArrowDown, contentDescription = "Close", tint = accentColor, modifier = Modifier.size(32.dp))
                }
            }

            // --- SECTION 2: SONG INFO ---
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = songTitle,
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Black,
                        letterSpacing = (-1).sp,
                        lineHeight = 36.sp
                    ),
                    color = accentColor,
                    textAlign = TextAlign.Center,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = artistName.uppercase(),
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp
                    ),
                    color = mutedTextColor,
                    textAlign = TextAlign.Center
                )
            }

            // --- SECTION 3: SEEK BAR ---
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp)
            ) {
                Slider(
                    value = currentTime,
                    onValueChange = onSeek,
                    valueRange = 0f..duration,
                    modifier = Modifier.fillMaxWidth(),
                    colors = SliderDefaults.colors(
                        thumbColor = accentColor,
                        activeTrackColor = accentColor,
                        inactiveTrackColor = accentColor.copy(alpha = 0.1f)
                    )
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(text = "1:24", color = mutedTextColor, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Text(text = "4:32", color = mutedTextColor, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }

            // --- SECTION 4: CONTROLS ---
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 40.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onPrevious, modifier = Modifier.size(56.dp)) {
                    Icon(Icons.Rounded.SkipPrevious, contentDescription = "Previous", tint = accentColor, modifier = Modifier.size(36.dp))
                }
                Spacer(modifier = Modifier.width(32.dp))
                
                // HERO PLAY BUTTON
                Surface(
                    onClick = onPlayPause,
                    shape = CircleShape,
                    color = accentColor,
                    modifier = Modifier.size(84.dp),
                    shadowElevation = 8.dp
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = if (isPlaying) Icons.Rounded.Pause else Icons.Rounded.PlayArrow,
                            contentDescription = "Play/Pause",
                            tint = backgroundColor,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.width(32.dp))
                IconButton(onClick = onNext, modifier = Modifier.size(56.dp)) {
                    Icon(Icons.Rounded.SkipNext, contentDescription = "Next", tint = accentColor, modifier = Modifier.size(36.dp))
                }
            }

            // --- SECTION 5: SECONDARY ACTIONS ---
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 32.dp, vertical = 24.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onFavoriteClick) {
                    Icon(
                        if (isFavorite) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                        contentDescription = "Like",
                        tint = if (isFavorite) Color.Red else mutedTextColor,
                        modifier = Modifier.size(24.dp)
                    )
                }
                IconButton(onClick = { /* Add to Playlist */ }) {
                    Icon(Icons.Rounded.Add, contentDescription = "Add to Playlist", tint = mutedTextColor)
                }
                IconButton(onClick = { /* Lyrics */ }) {
                    Icon(Icons.Rounded.TextSnippet, contentDescription = "Lyrics", tint = mutedTextColor)
                }
                IconButton(onClick = { /* Queue */ }) {
                    Icon(Icons.Rounded.QueueMusic, contentDescription = "Queue", tint = mutedTextColor)
                }
            }
        }
    }
}
