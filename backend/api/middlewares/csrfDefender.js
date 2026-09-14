"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.requireAppHeader = void 0;
var _AppError = require("../../core/errors/AppError");

const requireAppHeader = (req, res, next) => {
  // Allow safe methods without CSRF check
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Require x-app-client header for state-changing requests
  const clientHeader = req.headers['x-app-client'];
  if (!clientHeader) {
    throw new _AppError.ForbiddenError('Access denied: Missing CSRF protection header (x-app-client)');
  }

  next();
};exports.requireAppHeader = requireAppHeader;