"use strict";var _app = _interopRequireDefault(require("./app"));
var _env = require("./config/env");
var _logger = require("./config/logger");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const startServer = async () => {
  try {
    const port = _env.env.PORT || 3000;

    _app.default.listen(port, () => {
      _logger.logger.info(`Server is running on port ${port} in ${_env.env.NODE_ENV} mode`);
    });
  } catch (error) {
    _logger.logger.error(error, 'Failed to start server');
    process.exit(1);
  }
};

startServer();