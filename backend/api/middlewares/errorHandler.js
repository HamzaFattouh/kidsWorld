"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.errorHandler = void 0;
var _AppError = require("../../core/errors/AppError");
var _logger = require("../../config/logger");
var _env = require("../../config/env");

const errorHandler = (
err,
req,
res,

next) =>
{
  if (err instanceof _AppError.AppError) {
    _logger.logger.warn({ err }, err.message);
    return res.status(err.statusCode).json({
      error: {
        code: err.name,
        message: err.message
      }
    });
  }

  // Unhandled/Unexpected Errors
  _logger.logger.error({ err }, 'Unhandled error');
  return res.status(500).json({
    error: {
      code: 'InternalServerError',
      message: _env.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    }
  });
};exports.errorHandler = errorHandler;