const axios = require('axios');

exports.getLyrics = async (artist, title) => {
    try {
        // Lyrics.ovh is a simple public API
        const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
        return response.data.lyrics;
    } catch (error) {
        console.error('Lyrics Error:', error.message);
        return null;
    }
};
