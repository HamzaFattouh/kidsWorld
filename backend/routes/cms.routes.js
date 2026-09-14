"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.cmsRoutes = void 0;var _express = require("express");
var _cms = require("../controllers/cms.controller");

const router = exports.cmsRoutes = (0, _express.Router)();

// Endpoint for uploading CMS images
// We should ideally protect this with an auth middleware that checks for ADMIN role.
// For now, it will be publicly accessible in development, or we can add basic protection if available.
router.post('/upload-image', _cms.uploadImage);