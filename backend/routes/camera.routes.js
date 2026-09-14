"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.cameraRoutes = void 0;var _express = require("express");
var _camera = require("../controllers/camera.controller");
var _sessionValidator = require("../api/middlewares/sessionValidator");
var _expressRateLimit = require("express-rate-limit");

const router = exports.cameraRoutes = (0, _express.Router)();

// Protect all camera routes with authentication
router.use(_sessionValidator.requireAuth);

// Rate limiter specifically for requesting camera stream tokens to prevent brute forcing or abuse
const accessLimiter = (0, _expressRateLimit.rateLimit)({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP/user to 10 requests per minute
  message: { error: 'Too many stream requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Routes
router.get('/', _camera.cameraController.getCameras.bind(_camera.cameraController));
router.post('/:id/access', accessLimiter, _camera.cameraController.getCameraAccess.bind(_camera.cameraController));