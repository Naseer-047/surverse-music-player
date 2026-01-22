const axios = require('axios');

class JioSaavnService {
    constructor() {
        this.baseUrl = 'https://www.jiosaavn.com/api.php';
    }

    async _fetch(params) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    _format: 'json',
                    _marker: 0,
                    ctx: 'web6dot0',
                    ...params
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://www.jiosaavn.com/'
                }
            });
            return response.data;
        } catch (error) {
            console.error('JioSaavn API Error:', error.message);
            throw new Error('Failed to fetch data from JioSaavn');
        }
    }

    async search(query) {
        // Search for songs
        const data = await this._fetch({
            __call: 'search.getResults',
            p: 1,
            n: 20,
            q: query
        });
        
        // Transform data to a cleaner format
        if (data && data.results) {
            return data.results.map(this._transformSong);
        }
        return [];
    }

    async getTrending() {
        // Fetch Top Charts / Trending
        // launch_data gives us the homepage data
        const data = await this._fetch({
            __call: 'webapi.getLaunchData',
        });
        
        // Extracting new trending/charts. This structure is complex and changes, 
        // using a specific playlist or chart ID is often safer.
        // For now, let's try to fetch a specific 'Trending' playlist if possible, 
        // or just return the 'new_trending' section if it exists.
        
        // Alternative: Fetch Top 20 Global or Hindi Chart
        // List ID for 'Weekly Top Songs' (Hindi) - usually available via search or hardcoded IDs
        // Let's use a standard "Hindi Top" query or specific playlist ID if known.
        // Fallback: Search for "Top Hindi"
        return this.search('Top Hindi 2024'); 
    }

    async getSongDetails(id) {
        const data = await this._fetch({
            __call: 'song.getDetails',
            pids: id
        });
        
        if (data && data[id]) {
            return this._transformSong(data[id]);
        }
        return null;
    }
    
    _transformSong(song) {
        // Helper to normalize JioSaavn response
        return {
            id: song.id,
            name: song.song,
            artist: song.primary_artists || song.more_info?.artist_map?.primary_artists?.map(a => a.name).join(', '),
            album: song.album,
            image: song.image?.replace('150x150', '500x500'), // High quality
            duration: song.duration,
            url: song.media_preview_url || song.more_info?.encrypted_media_url, // Start with preview, stream URL needs decryption usually
            // Note: True stream URL decryption (from encrypted_media_url) requires specific logic 
            // In a real 'unofficial' wrapper, we'd decode this.
            // For this demo, we'll expose the properties available.
            encrypted_url: song.encrypted_media_url,
            has_lyrics: song.has_lyrics
        };
    }
}

module.exports = new JioSaavnService();
