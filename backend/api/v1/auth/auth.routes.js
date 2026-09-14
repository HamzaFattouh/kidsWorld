"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _auth = require("./auth.controller");
var _validateRequest = require("../../middlewares/validateRequest");
var _sessionValidator = require("../../middlewares/sessionValidator");
var _rateLimiter = require("../../middlewares/rateLimiter");

const authRouter = (0, _express.Router)();

authRouter.post('/login', _rateLimiter.authLimiter, (0, _validateRequest.validateRequest)(_auth.loginSchema), _auth.login);
authRouter.post('/logout', _auth.logout);
authRouter.post('/forgot-password', _rateLimiter.authLimiter, _auth.forgotPassword);
authRouter.post('/reset-password', (0, _validateRequest.validateRequest)(_auth.resetPasswordSchema), _auth.resetPassword);
authRouter.post('/verify-email', _auth.verifyEmail);
authRouter.post('/change-password', _sessionValidator.requireAuth, (0, _validateRequest.validateRequest)(_auth.changePasswordSchema), _auth.forceChangePassword);var _default = exports.default =

authRouter;