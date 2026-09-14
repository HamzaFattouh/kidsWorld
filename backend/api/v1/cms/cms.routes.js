"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _cms = require("./cms.controller");
var _cms2 = require("./cms.dto");
var _validateRequest = require("../../middlewares/validateRequest");
var _sessionValidator = require("../../middlewares/sessionValidator");
var _authorize = require("../../middlewares/authorize");
var _upload = require("../../middlewares/upload");

const cmsRouter = (0, _express.Router)();

// Public Routes (Optional Auth)
cmsRouter.get('/announcements', _cms.getAnnouncements);
cmsRouter.get('/posts', _cms.getPosts);
cmsRouter.get('/events', _cms.getEvents);
cmsRouter.get('/homepage-config', _cms.getHomepageConfig);

// Protected Admin Routes
cmsRouter.post('/announcements', _sessionValidator.requireAuth, (0, _authorize.requirePermission)('MANAGE_USERS'), (0, _validateRequest.validateRequest)(_cms2.createAnnouncementSchema), _cms.createAnnouncement);
cmsRouter.post('/posts', _sessionValidator.requireAuth, (0, _authorize.requirePermission)('MANAGE_USERS'), (0, _validateRequest.validateRequest)(_cms2.createPostSchema), _cms.createPost);
cmsRouter.post('/events', _sessionValidator.requireAuth, (0, _authorize.requirePermission)('MANAGE_USERS'), _upload.upload.single('image'), (0, _validateRequest.validateRequest)(_cms2.createEventSchema), _cms.createEvent);
cmsRouter.post('/homepage-config', _sessionValidator.requireAuth, (0, _authorize.requirePermission)('MANAGE_USERS'), (0, _validateRequest.validateRequest)(_cms2.updateHomepageConfigSchema), _cms.updateHomepageConfig);
cmsRouter.post('/gallery', _sessionValidator.requireAuth, (0, _authorize.requirePermission)('MANAGE_USERS'), _upload.upload.single('image'), _cms.uploadGallery);var _default = exports.default =

cmsRouter;