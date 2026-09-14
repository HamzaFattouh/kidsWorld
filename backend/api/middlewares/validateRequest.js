"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.validateRequest = void 0;
var _zod = require("zod");

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      return next();
    } catch (error) {
      if (error instanceof _zod.ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
        // Could attach detailed errors, but throwing a generic ValidationError for now
        // to be caught by the global error handler
        return res.status(400).json({
          error: {
            code: 'ValidationError',
            message: 'Invalid request parameters',
            details: errorMessages
          }
        });
      }
      return next(error);
    }
  };
};exports.validateRequest = validateRequest;