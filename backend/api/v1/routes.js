"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _health = require("./health/health.controller");
var _auth = _interopRequireDefault(require("./auth/auth.routes"));
var _core = _interopRequireDefault(require("./core/core.routes"));
var _operations = _interopRequireDefault(require("./operations/operations.routes"));
var _reporting = _interopRequireDefault(require("./reporting/reporting.routes"));
var _communication = _interopRequireDefault(require("./communication/communication.routes"));
var _notifications = _interopRequireDefault(require("./notifications/notifications.routes"));
var _cms = _interopRequireDefault(require("./cms/cms.routes"));
var _users = _interopRequireDefault(require("./users/users.routes"));
var _auto = _interopRequireDefault(require("./auto/auto.routes"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const v1Router = (0, _express.Router)();

v1Router.use('/auth', _auth.default);
v1Router.use('/core', _core.default);
v1Router.use('/operations', _operations.default);
v1Router.use('/reporting', _reporting.default);
v1Router.use('/communication', _communication.default);
v1Router.use('/notifications', _notifications.default);
v1Router.use('/cms', _cms.default);
v1Router.use('/users', _users.default);
v1Router.use('/auto', _auto.default);

v1Router.get('/health', _health.getHealthStatus);var _default = exports.default =

v1Router;