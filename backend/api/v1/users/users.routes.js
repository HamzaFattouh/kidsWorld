"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _users = require("./users.controller");
var _users2 = require("./users.dto");
var _validateRequest = require("../../middlewares/validateRequest");
var _sessionValidator = require("../../middlewares/sessionValidator");
var _authorize = require("../../middlewares/authorize");

const usersRouter = (0, _express.Router)();

usersRouter.post('/', _sessionValidator.requireAuth, (0, _authorize.requirePermission)('manage:users'), (0, _validateRequest.validateRequest)(_users2.createUserSchema), _users.createUser);
usersRouter.get('/', _sessionValidator.requireAuth, (0, _authorize.requirePermission)('manage:users'), (0, _validateRequest.validateRequest)(_users2.queryUsersSchema), _users.listUsers);
usersRouter.put('/setup-profile', _sessionValidator.requireAuth, _users.setupProfile);var _default = exports.default =

usersRouter;