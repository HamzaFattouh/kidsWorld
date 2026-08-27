import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../core/errors/AppError';
import { logger } from '../../config/logger';
import { env } from '../../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn({ err }, err.message);
    return res.status(err.statusCode).json({
      error: {
        code: err.name,
        message: err.message,
      },
    });
  }

  // Unhandled/Unexpected Errors
  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({
    error: {
      code: 'InternalServerError',
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
};
