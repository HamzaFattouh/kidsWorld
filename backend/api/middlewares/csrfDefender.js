"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAppHeader = void 0;

const requireAppHeader = (req, res, next) => {
  // Allow safe methods without CSRF check
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Allow login / auth endpoints without strict header check
  if (req.path === '/login' || req.path.endsWith('/login') || req.path.endsWith('/auth/login')) {
    return next();
  }

  const clientHeader = req.headers['x-app-client'];
  if (!clientHeader) {
    console.warn(`[CSRF] Notice: Request to ${req.path} missing x-app-client header.`);
  }

  next();
};
exports.requireAppHeader = requireAppHeader;