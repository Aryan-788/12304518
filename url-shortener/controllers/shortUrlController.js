const Log = require('../utils/logger');
const ShortUrl = require('../models/ShortUrl');
const ClickLog = require('../models/ClickLog');
const generateShortcode = require('../utils/generateShortcode');
const validator = require('validator');

exports.createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !validator.isURL(url)) {
    await Log("backend", "error", "handler", "Invalid or missing URL");
    return res.status(400).json({ message: 'Invalid or missing URL' });
  }

  try {
    const expiry = new Date(Date.now() + validity * 60000);
    let finalCode = shortcode;

    if (shortcode) {
      const exists = await ShortUrl.findOne({ shortcode });
      if (exists) {
        await Log("backend", "warn", "handler", `Shortcode collision: ${shortcode}`);
        return res.status(409).json({ message: 'Shortcode already in use' });
      }
    } else {
      let unique = false;
      while (!unique) {
        finalCode = generateShortcode();
        unique = !(await ShortUrl.findOne({ shortcode: finalCode }));
      }
    }

    const shortUrl = await ShortUrl.create({ originalUrl: url, shortcode: finalCode, expiry });
    await Log("backend", "info", "handler", `Short URL created for ${url} as ${finalCode}`);

    return res.status(201).json({
      shortLink: `${process.env.HOSTNAME}/${finalCode}`,
      expiry: shortUrl.expiry.toISOString()
    });
  } catch (err) {
    await Log("backend", "fatal", "handler", "Unexpected error in createShortUrl: " + err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getShortUrlStats = async (req, res) => {
  const { shortcode } = req.params;

  try {
    const shortUrl = await ShortUrl.findOne({ shortcode });
    if (!shortUrl) {
      await Log("backend", "warn", "handler", `Shortcode ${shortcode} not found`);
      return res.status(404).json({ message: "Shortcode not found" });
    }

    const clickLogs = await ClickLog.find({ shortcode });

    const response = {
      originalUrl: shortUrl.originalUrl,
      createdAt: shortUrl.createdAt,
      expiry: shortUrl.expiry,
      totalClicks: clickLogs.length,
      clicks: clickLogs.map(log => ({
        timestamp: log.timestamp,
        referrer: log.referrer,
        location: log.location
      }))
    };

    await Log("backend", "info", "handler", `Stats fetched for shortcode ${shortcode}`);
    res.json(response);
  } catch (err) {
    await Log("backend", "error", "handler", `Error in getShortUrlStats: ${err.message}`);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.redirectToOriginal = async (req, res) => {
  const { shortcode } = req.params;

  try {
    const shortUrl = await ShortUrl.findOne({ shortcode });

    if (!shortUrl) {
      await Log("backend", "warn", "handler", `Shortcode ${shortcode} not found for redirection`);
      return res.status(404).json({ message: "Shortcode not found" });
    }

    if (new Date() > shortUrl.expiry) {
      await Log("backend", "warn", "handler", `Shortcode ${shortcode} has expired`);
      return res.status(410).json({ message: "Shortcode has expired" });
    }

    // Save click data
    await ClickLog.create({
      shortcode,
      referrer: req.get('Referrer') || 'Direct',
      location: req.ip 
    });

    await Log("backend", "info", "handler", `Redirected to ${shortUrl.originalUrl}`);
    return res.redirect(shortUrl.originalUrl);
  } catch (err) {
    await Log("backend", "fatal", "handler", `Redirection error for ${shortcode}: ${err.message}`);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
