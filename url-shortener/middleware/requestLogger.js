const Log = require('../utils/logger');

module.exports = async (req, res, next) => {
  await Log("backend", "info", "router", `Incoming ${req.method} ${req.originalUrl}`);
  next();
};
