"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _communication = require("./communication.controller");
var _communication2 = require("./communication.dto");
var _validateRequest = require("../../middlewares/validateRequest");
var _sessionValidator = require("../../middlewares/sessionValidator");

const commRouter = (0, _express.Router)();

// Everyone relies on token identity for authorization here.

commRouter.post('/complaints', _sessionValidator.requireAuth, (0, _validateRequest.validateRequest)(_communication2.createComplaintSchema), _communication.createComplaint);
commRouter.get('/complaints', _sessionValidator.requireAuth, _communication.getComplaints);

commRouter.post('/requests', _sessionValidator.requireAuth, (0, _validateRequest.validateRequest)(_communication2.createRequestSchema), _communication.createRequest);
commRouter.get('/requests', _sessionValidator.requireAuth, _communication.getRequests);

commRouter.post('/messages', _sessionValidator.requireAuth, (0, _validateRequest.validateRequest)(_communication2.sendMessageSchema), _communication.sendMessage);
commRouter.get('/messages/:otherUserId', _sessionValidator.requireAuth, _communication.getThread);var _default = exports.default =

commRouter;