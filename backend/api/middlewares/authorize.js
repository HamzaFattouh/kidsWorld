"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.requirePermission = exports.requireOwnership = void 0;
var _AppError = require("../../core/errors/AppError");
var _AuthzService = require("../../services/AuthzService");


const authzService = new _AuthzService.AuthzService();

const requirePermission = (action) => {
  return async (req, res, next) => {
    try {
      const user = req.user; // Set by sessionValidator (requireAuth)
      if (!user) {
        throw new _AppError.ForbiddenError('Access denied: unauthenticated');
      }

      const hasPermission = await authzService.checkPermission(user.role, action);
      if (!hasPermission) {
        throw new _AppError.ForbiddenError(`Access denied: missing permission '${action}'`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};exports.requirePermission = requirePermission;

const requireOwnership = (resourceType, paramKey = 'id') => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw new _AppError.ForbiddenError('Access denied: unauthenticated');
      }

      const resourceId = req.params[paramKey] || req.body[paramKey] || req.query[paramKey];
      if (!resourceId) {
        throw new _AppError.ForbiddenError('Access denied: resource ID missing from request');
      }

      const hasOwnership = await authzService.checkOwnership(user.role, user.userId, resourceType, resourceId);

      if (!hasOwnership) {
        throw new _AppError.ForbiddenError('Access denied: you do not own or have access to this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};exports.requireOwnership = requireOwnership;