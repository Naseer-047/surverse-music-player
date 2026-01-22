const axios = require('axios');
const CryptoJS = require('crypto-js');

const BASE_URL = 'https://www.jiosaavn.com/api.php';

const cleanString = (str) => {
    if (!str) return '';
    return str.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'");
};

const decryptUrl = (encrypted) => {
    try {
        const key = CryptoJS.enc.Utf8.parse('38346591');
        const decrypted = CryptoJS.DES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(encrypted) },
            key,
            { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        );
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error('Decryption Failed:', e.message);
        return null;
    }
};

// Formatting helper to clean up the response
const formatSong = (song) => {
    const token = song.perma_url?.split('/').pop();
    return {
        id: token || song.id,
        title: cleanString(song.title || song.song),
        artist: cleanString(song.more_info?.artistMap?.primary_artists?.[0]?.name || song.more_info?.music || ""),
        album: cleanString(song.more_info?.album),
        image: song.image, 
        url: decryptUrl(song.more_info?.encrypted_media_url), 
        duration: song.more_info?.duration,
        has_lyrics: song.more_info?.has_lyrics,
        copyright: song.more_info?.copyright_text,
        year: song.year,
        primary_artists: song.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', '),
        token_url: song.perma_url
    };
};

const getHeaders = () => {
    return {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
    };
};

// SEARCH
exports.searchSongs = async (query) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                __call: 'search.getResults',
                q: query,
                _format: 'json',
                _marker: '0',
                api_version: '4',
                ctx: 'web6dot0',
                p: '1',
                n: '20'
            },
            headers: getHeaders()
        });
        
        // Note: The structure varies, we need to handle "results"
        const data = response.data;
        if (data && data.results) {
             return data.results.map(formatSong);
        }
        return [];
    } catch (error) {
        console.error("JioSaavn Search Error:", error.message);
        return [];
    }
};

// Global Search (All Types)
exports.globalSearch = async (query) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                __call: 'autocomplete.get',
                query: query,
                _format: 'json',
                _marker: '0',
                api_version: '4',
                ctx: 'web6dot0'
            },
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
         console.error("JioSaavn Global Search Error:", error.message);
         return null;
    }
};

// SONG DETAILS & STREAM URL
exports.getSongDetails = async (id) => {
    try {
        let params = {
            _format: 'json',
            _marker: '0',
            api_version: '4',
            ctx: 'web6dot0'
        };

        if (isNaN(id)) {
            // Alphanumeric ID -> likely a token, use webapi.get
            params.__call = 'webapi.get';
            params.token = id;
            params.type = 'song';
        } else {
            // Numeric -> PID
            params.__call = 'song.getDetails';
            params.pids = id;
        }

        const response = await axios.get(BASE_URL, {
            params: params,
            headers: getHeaders()
        });
        
        console.log(`[DEBUG] Song Details for ${id}:`, JSON.stringify(response.data).substring(0, 1000));

        if (response.data && response.data.songs) {
            // webapi.get returns { songs: [ ... ] }
            return formatSong(response.data.songs[0]);
        }
        
        if (response.data && response.data[id]) {
             // song.getDetails returns { [id]: { ... } }
            return formatSong(response.data[id]);
        }
        
        return null;
    } catch (error) {
        console.error("JioSaavn Detail Error:", error.message);
        return null;
    }
};

// Helper mainly for trending/home
exports.getTrending = async () => {
   try {
        const response = await axios.get(BASE_URL, {
            params: {
                __call: 'content.getTrending',
                _format: 'json',
                _marker: '0',
                api_version: '4',
                ctx: 'web6dot0'
            },
            headers: getHeaders()
        });
        return response.data;
   } catch (error) {
       return [];
   }
}
