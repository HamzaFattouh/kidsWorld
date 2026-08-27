import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../core/errors/AppError';

export const requireAppHeader = (req: Request, res: Response, next: NextFunction) => {
  // Allow safe methods without CSRF check
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Require x-app-client header for state-changing requests
  const clientHeader = req.headers['x-app-client'];
  if (!clientHeader) {
    throw new ForbiddenError('Access denied: Missing CSRF protection header (x-app-client)');
  }

  next();
};
