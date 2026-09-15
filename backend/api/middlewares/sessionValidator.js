"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _AppError = require("../../core/errors/AppError");
var _SessionRepository = require("../../repositories/SessionRepository");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';
const sessionRepo = new _SessionRepository.SessionRepository();

const requireAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new _AppError.UnauthorizedError('Missing authentication token'));
    }

    try {
      const payload = _jsonwebtoken.default.verify(token, JWT_SECRET);
      req.user = payload;
      return next();
    } catch (jwtErr) {
      return next(new _AppError.UnauthorizedError('Invalid or expired token'));
    }
  } catch (error) {
    next(new _AppError.UnauthorizedError('Authentication failed'));
  }
};
exports.requireAuth = requireAuth;