const ytSearch = require('yt-search');

exports.search = async (query) => {
    try {
        const results = await ytSearch(query + ' audio');
        return results.videos.slice(0, 10).map(v => ({
            id: v.videoId,
            title: v.title,
            artist: v.author.name,
            image: v.thumbnail,
            duration: v.timestamp,
            url: v.url, // This is just the video URL, playback handling will be on frontend via ReactPlayer or similar if direct stream fails
            source: 'youtube'
        }));
    } catch (e) {
        console.error('YouTube Search Error:', e.message);
        return [];
    }
};
