"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cameraRoutes = void 0;

var _express = require("express");
var _camera = require("../controllers/camera.controller");
var _sessionValidator = require("../api/middlewares/sessionValidator");
var _expressRateLimit = require("express-rate-limit");

const router = (exports.cameraRoutes = (0, _express.Router)());

// Protect all camera routes with authentication
router.use(_sessionValidator.requireAuth);

// Rate limiter specifically for requesting camera stream tokens
const accessLimiter = (0, _expressRateLimit.rateLimit)({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { error: 'Too many stream requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Permissions Management Routes (Must be before :id)
router.get('/permissions', _camera.cameraController.getPermissionsMatrix.bind(_camera.cameraController));
router.put('/permissions/:userId', _camera.cameraController.updateUserPermissions.bind(_camera.cameraController));
router.post('/permissions/reset/:userId', _camera.cameraController.resetUserPermissions.bind(_camera.cameraController));

// Camera General Routes
router.get('/', _camera.cameraController.getCameras.bind(_camera.cameraController));
router.put('/:id', _camera.cameraController.updateCamera.bind(_camera.cameraController));
router.post('/:id/access', accessLimiter, _camera.cameraController.getCameraAccess.bind(_camera.cameraController));