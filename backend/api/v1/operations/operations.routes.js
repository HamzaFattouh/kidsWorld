"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _operations = require("./operations.controller");
var _operations2 = require("./operations.dto");
var _validateRequest = require("../../middlewares/validateRequest");
var _sessionValidator = require("../../middlewares/sessionValidator");
var _authorize = require("../../middlewares/authorize");

const opsRouter = (0, _express.Router)();

// Middleware: Teachers log data (body childId is validated), Parents/Teachers view data (param childId is validated)
// We rely on requireOwnership which checks params, body, or query for ID.

opsRouter.post('/attendance', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), (0, _validateRequest.validateRequest)(_operations2.logAttendanceSchema), _operations.logAttendance);
opsRouter.get('/attendance/:childId', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), (0, _validateRequest.validateRequest)(_operations2.getAttendanceSchema), _operations.getAttendance);

opsRouter.post('/meals', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), (0, _validateRequest.validateRequest)(_operations2.logMealSchema), _operations.logMeal);
opsRouter.get('/meals/:childId', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), _operations.getMeals);

opsRouter.post('/activities', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), (0, _validateRequest.validateRequest)(_operations2.logActivitySchema), _operations.logActivity);
opsRouter.get('/activities/:childId', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), _operations.getActivities);var _default = exports.default =

opsRouter;