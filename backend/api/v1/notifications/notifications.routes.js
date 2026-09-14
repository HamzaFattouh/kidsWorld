"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _notifications = require("./notifications.controller");
var _notifications2 = require("./notifications.dto");
var _validateRequest = require("../../middlewares/validateRequest");
var _sessionValidator = require("../../middlewares/sessionValidator");

const notifRouter = (0, _express.Router)();

notifRouter.use(_sessionValidator.requireAuth);

notifRouter.post('/device', (0, _validateRequest.validateRequest)(_notifications2.registerDeviceSchema), _notifications.registerDevice);
notifRouter.delete('/device/:token', _notifications.removeDevice);

notifRouter.get('/preferences', _notifications.getPreferences);
notifRouter.patch('/preferences', (0, _validateRequest.validateRequest)(_notifications2.updatePreferenceSchema), _notifications.updatePreferences);

notifRouter.get('/inbox', _notifications.getInbox);
notifRouter.patch('/inbox/:id/read', _notifications.markAsRead);var _default = exports.default =

notifRouter;