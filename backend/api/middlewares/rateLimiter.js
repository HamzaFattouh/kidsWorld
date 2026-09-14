"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.authLimiter = exports.apiLimiter = void 0;var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const apiLimiter = exports.apiLimiter = (0, _expressRateLimit.default)({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = exports.authLimiter = (0, _expressRateLimit.default)({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 attempts
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});