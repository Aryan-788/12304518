const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  originalUrl: String,
  shortcode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiry: Date,
  clicks: { type: Number, default: 0 },
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);

