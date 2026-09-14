"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.ValidationError = exports.UnauthorizedError = exports.NotFoundError = exports.ForbiddenError = exports.BadRequestError = exports.AppError = void 0;class AppError extends Error {



  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}exports.AppError = AppError;

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}exports.NotFoundError = NotFoundError;

class ValidationError extends AppError {
  constructor(message = 'Validation Error') {
    super(message, 400);
  }
}exports.ValidationError = ValidationError;

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}exports.UnauthorizedError = UnauthorizedError;

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}exports.ForbiddenError = ForbiddenError;

class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}exports.BadRequestError = BadRequestError;