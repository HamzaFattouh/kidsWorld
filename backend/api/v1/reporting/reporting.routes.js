"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _reporting = require("./reporting.controller");
var _reporting2 = require("./reporting.dto");
var _validateRequest = require("../../middlewares/validateRequest");
var _sessionValidator = require("../../middlewares/sessionValidator");
var _authorize = require("../../middlewares/authorize");

const reportingRouter = (0, _express.Router)();

reportingRouter.post('/incidents', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), (0, _validateRequest.validateRequest)(_reporting2.createIncidentSchema), _reporting.createIncident);
reportingRouter.get('/incidents/:childId', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), _reporting.getIncidents);

reportingRouter.post('/notes', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), (0, _validateRequest.validateRequest)(_reporting2.createWeeklyNoteSchema), _reporting.createWeeklyNote);
reportingRouter.get('/notes/:childId', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), _reporting.getWeeklyNotes);

reportingRouter.post('/evaluations', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), (0, _validateRequest.validateRequest)(_reporting2.createEvaluationSchema), _reporting.createEvaluation);
reportingRouter.get('/evaluations/:childId', _sessionValidator.requireAuth, (0, _authorize.requireOwnership)('child', 'childId'), _reporting.getEvaluations);var _default = exports.default =

reportingRouter;