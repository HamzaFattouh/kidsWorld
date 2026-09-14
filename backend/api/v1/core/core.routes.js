"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _core = require("./core.controller");
var _core2 = require("./core.dto");
var _validateRequest = require("../../middlewares/validateRequest");
var _sessionValidator = require("../../middlewares/sessionValidator");
var _authorize = require("../../middlewares/authorize");

const coreRouter = (0, _express.Router)();

// Classes (Admin manages, everyone can list)
coreRouter.post('/classes', _sessionValidator.requireAuth, (0, _authorize.requirePermission)('manage:classes'), (0, _validateRequest.validateRequest)(_core2.createClassSchema), _core.createClass);
coreRouter.get('/classes', _sessionValidator.requireAuth, (0, _validateRequest.validateRequest)(_core2.querySchema), _core.listClasses);

// Children
coreRouter.post('/children', _sessionValidator.requireAuth, (0, _authorize.requirePermission)('manage:children'), (0, _validateRequest.validateRequest)(_core2.createChildSchema), _core.createChild);
coreRouter.get('/children', _sessionValidator.requireAuth, (0, _validateRequest.validateRequest)(_core2.querySchema), _core.listChildren);
coreRouter.get('/children/:id', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child'), _core.getChild);var _default = exports.default =

coreRouter;