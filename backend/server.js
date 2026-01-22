const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

const jiosaavn = require('./api/jiosaavn');

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/surverse')
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('SurVerse API is Running');
});

// API Routes
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query parameter "q" is required' });
    
    try {
        const results = await jiosaavn.searchSongs(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Search failed' });
    }
});

app.get('/api/songs/:id', async (req, res) => {
    try {
        const song = await jiosaavn.getSongDetails(req.params.id);
        if (!song) return res.status(404).json({ error: 'Song not found' });
        res.json(song);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch song' });
    }
});

const lyricsApi = require('./api/lyrics');
app.get('/api/lyrics', async (req, res) => {
    const { artist, title } = req.query;
    if (!artist || !title) return res.status(400).json({ error: 'Artist and Title required' });

    try {
        const lyrics = await lyricsApi.getLyrics(artist, title);
        res.json({ lyrics: lyrics || 'Lyrics not found' });
    } catch (err) {
        res.json({ lyrics: 'Lyrics not found' });
    }
});

const youtube = require('./api/youtube');
app.get('/api/youtube/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query parameter "q" is required' });

    try {
        const results = await youtube.search(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'YouTube search failed' });
    }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
