const jiosaavnService = require('../services/jiosaavnService');

exports.getTrending = async (req, res) => {
    try {
        const data = await jiosaavnService.getTrending();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.searchMusic = async (req, res) => {
    try {
        const { query } = req.query;
        const data = await jiosaavnService.search(query || 'Arijit Singh'); // Default query if empty
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
