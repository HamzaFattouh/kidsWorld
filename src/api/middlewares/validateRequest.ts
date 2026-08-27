import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodIssue } from 'zod';

export const validateRequest = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join('.'),
          message: issue.message,
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
};
