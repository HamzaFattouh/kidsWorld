import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../core/errors/AppError';
import { AuthzService } from '../../services/AuthzService';
import { Role } from '@prisma/client';

const authzService = new AuthzService();

export const requirePermission = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user; // Set by sessionValidator (requireAuth)
      if (!user) {
        throw new ForbiddenError('Access denied: unauthenticated');
      }

      const hasPermission = await authzService.checkPermission(user.role as Role, action);
      if (!hasPermission) {
        throw new ForbiddenError(`Access denied: missing permission '${action}'`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireOwnership = (resourceType: string, paramKey: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new ForbiddenError('Access denied: unauthenticated');
      }

      const resourceId = req.params[paramKey] || req.body[paramKey] || req.query[paramKey];
      if (!resourceId) {
        throw new ForbiddenError('Access denied: resource ID missing from request');
      }

      const hasOwnership = await authzService.checkOwnership(user.role as Role, user.userId, resourceType, resourceId);
      
      if (!hasOwnership) {
        throw new ForbiddenError('Access denied: you do not own or have access to this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
