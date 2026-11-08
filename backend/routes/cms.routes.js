"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmsRoutes = void 0;

var _express = require("express");
var _cms = require("../controllers/cms.controller");
var _sessionValidator = require("../api/middlewares/sessionValidator");
var _authorize = require("../api/middlewares/authorize");

const router = exports.cmsRoutes = (0, _express.Router)();

// Protected endpoint for uploading CMS images (Admin role required)
router.post(
  '/upload-image',
  _sessionValidator.requireAuth,
  (0, _authorize.requirePermission)('MANAGE_USERS'),
  _cms.uploadImage
);
