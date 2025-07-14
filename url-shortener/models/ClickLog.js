const mongoose = require('mongoose');

const clickLogSchema = new mongoose.Schema({
  shortcode: String,
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String, 
});

module.exports = mongoose.model('ClickLog', clickLogSchema);
