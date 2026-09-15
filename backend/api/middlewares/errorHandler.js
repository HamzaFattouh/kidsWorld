"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var _AppError = require("../../core/errors/AppError");
var _logger = require("../../config/logger");
var _env = require("../../config/env");

const errorHandler = (err, req, res, next) => {
  if (err instanceof _AppError.AppError) {
    _logger.logger.warn({ err }, err.message);
    return res.status(err.statusCode).json({
      error: {
        code: err.name,
        message: err.message,
      },
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  _logger.logger.error({ err }, err.message || 'Unhandled error');

  return res.status(statusCode).json({
    error: {
      code: err.name || (statusCode === 400 ? 'BadRequest' : 'InternalServerError'),
      message: err.message || 'Internal server error',
    },
  });
};
exports.errorHandler = errorHandler;