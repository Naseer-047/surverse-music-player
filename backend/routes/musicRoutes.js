const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');

router.get('/trending', musicController.getTrending);
router.get('/search', musicController.searchMusic);

module.exports = router;
