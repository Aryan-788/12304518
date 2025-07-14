// 📁 routes/shortUrlRoutes.js
const express = require('express');
const { createShortUrl, redirectToOriginal, getShortUrlStats } = require('../controllers/shortUrlController');
const router = express.Router();

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getShortUrlStats);
router.get('/:shortcode', redirectToOriginal);

module.exports = router;
