"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _auto = require("./auto.controller");
var _sessionValidator = require("../../middlewares/sessionValidator");

const autoRouter = (0, _express.Router)();

// Generic auto routes for rapid prototyping of all modules
autoRouter.get('/:resource', _sessionValidator.requireAuth, _auto.listResource);
autoRouter.post('/:resource', _sessionValidator.requireAuth, _auto.createResource);
autoRouter.put('/:resource/:id', _sessionValidator.requireAuth, _auto.updateResource);
autoRouter.delete('/:resource/:id', _sessionValidator.requireAuth, _auto.deleteResource);
var _default = exports.default =

autoRouter;