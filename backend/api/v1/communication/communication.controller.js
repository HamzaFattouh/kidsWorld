"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.sendMessage = exports.getThread = exports.getRequests = exports.getComplaints = exports.createRequest = exports.createComplaint = void 0;
var _CommunicationService = require("../../../services/CommunicationService");
var _AuditService = require("../../../services/AuditService");

const commService = new _CommunicationService.CommunicationService();

const createComplaint = async (req, res, next) => {
  try {
    const user = req.user;
    const payload = { ...req.body, parentId: user.userId };
    const record = await commService.createComplaint(payload);
    await _AuditService.auditService.log({
      action: 'COMPLAINT_CREATED',
      userId: user.userId,
      resource: 'COMPLAINT',
      resourceId: record.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.createComplaint = createComplaint;

const getComplaints = async (req, res, next) => {
  try {
    const user = req.user;
    const records = await commService.getComplaints(user.role, user.userId);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getComplaints = getComplaints;

const createRequest = async (req, res, next) => {
  try {
    const user = req.user;
    const payload = { ...req.body, parentId: user.userId };
    const record = await commService.createRequest(payload);
    await _AuditService.auditService.log({
      action: 'REQUEST_CREATED',
      userId: user.userId,
      resource: 'PARENT_REQUEST',
      resourceId: record.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.createRequest = createRequest;

const getRequests = async (req, res, next) => {
  try {
    const user = req.user;
    const records = await commService.getRequests(user.role, user.userId);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getRequests = getRequests;

const sendMessage = async (req, res, next) => {
  try {
    const user = req.user;
    const { receiverId, content } = req.body;
    const record = await commService.sendMessage(user.userId, user.role, receiverId, content);
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.sendMessage = sendMessage;

const getThread = async (req, res, next) => {
  try {
    const user = req.user;
    const targetUserId = req.params.otherUserId;
    const records = await commService.getThread(user.userId, targetUserId);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getThread = getThread;