"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.getWeeklyNotes = exports.getIncidents = exports.getEvaluations = exports.createWeeklyNote = exports.createIncident = exports.createEvaluation = void 0;
var _ReportingService = require("../../../services/ReportingService");
var _AuditService = require("../../../services/AuditService");

const reportingService = new _ReportingService.ReportingService();

const createIncident = async (req, res, next) => {
  try {
    const record = await reportingService.createIncident(req.body);
    const user = req.user;
    await _AuditService.auditService.log({
      action: 'INCIDENT_CREATED',
      userId: user?.userId || user?.id,
      resource: 'CHILD',
      resourceId: req.body.childId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.createIncident = createIncident;

const getIncidents = async (req, res, next) => {
  try {
    const user = req.user;
    const records = await reportingService.getIncidents(req.params.childId, user.role);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getIncidents = getIncidents;

const createWeeklyNote = async (req, res, next) => {
  try {
    const record = await reportingService.createWeeklyNote(req.body);
    const user = req.user;
    await _AuditService.auditService.log({
      action: 'WEEKLY_NOTE_CREATED',
      userId: user?.userId || user?.id,
      resource: 'CHILD',
      resourceId: req.body.childId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.createWeeklyNote = createWeeklyNote;

const getWeeklyNotes = async (req, res, next) => {
  try {
    const records = await reportingService.getWeeklyNotes(req.params.childId);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getWeeklyNotes = getWeeklyNotes;

const createEvaluation = async (req, res, next) => {
  try {
    const record = await reportingService.createEvaluation(req.body);
    const user = req.user;
    await _AuditService.auditService.log({
      action: 'EVALUATION_CREATED',
      userId: user?.userId || user?.id,
      resource: 'CHILD',
      resourceId: req.body.childId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.createEvaluation = createEvaluation;

const getEvaluations = async (req, res, next) => {
  try {
    const records = await reportingService.getEvaluations(req.params.childId);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getEvaluations = getEvaluations;