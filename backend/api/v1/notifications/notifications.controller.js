"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.updatePreferences = exports.removeDevice = exports.registerDevice = exports.markAsRead = exports.getPreferences = exports.getInbox = void 0;
var _NotificationService = require("../../../services/NotificationService");
var _AuditService = require("../../../services/AuditService");

const notifService = new _NotificationService.NotificationService();

const registerDevice = async (req, res, next) => {
  try {
    const user = req.user;
    await notifService.registerDevice(user.userId, req.body.token, req.body.deviceType);
    res.json({ success: true });
  } catch (error) {next(error);}
};exports.registerDevice = registerDevice;

const removeDevice = async (req, res, next) => {
  try {
    await notifService.removeDevice(req.params.token);
    res.json({ success: true });
  } catch (error) {next(error);}
};exports.removeDevice = removeDevice;

const updatePreferences = async (req, res, next) => {
  try {
    const user = req.user;
    const { type, isPushEnabled, isInAppEnabled } = req.body;
    await notifService.updatePreferences(user.userId, type, isPushEnabled, isInAppEnabled);
    await _AuditService.auditService.log({
      action: 'SETTINGS_UPDATED',
      userId: user.userId,
      resource: 'PREFERENCE',
      metadata: { type, isPushEnabled, isInAppEnabled },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.json({ success: true });
  } catch (error) {next(error);}
};exports.updatePreferences = updatePreferences;

const getPreferences = async (req, res, next) => {
  try {
    const user = req.user;
    const prefs = await notifService.getPreferences(user.userId);
    res.json({ data: prefs });
  } catch (error) {next(error);}
};exports.getPreferences = getPreferences;

const getInbox = async (req, res, next) => {
  try {
    const user = req.user;
    const inbox = await notifService.getInbox(user.userId);
    res.json({ data: inbox });
  } catch (error) {next(error);}
};exports.getInbox = getInbox;

const markAsRead = async (req, res, next) => {
  try {
    const user = req.user;
    await notifService.markAsRead(req.params.id, user.userId);
    res.json({ success: true });
  } catch (error) {next(error);}
};exports.markAsRead = markAsRead;