"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.listClasses = exports.listChildren = exports.getChild = exports.createClass = exports.createChild = void 0;
var _ChildService = require("../../../services/ChildService");
var _ClassService = require("../../../services/ClassService");
var _AuditService = require("../../../services/AuditService");

const childService = new _ChildService.ChildService();
const classService = new _ClassService.ClassService();

const createChild = async (req, res, next) => {
  try {
    const child = await childService.createChild(req.body);
    const user = req.user;
    await _AuditService.auditService.log({
      action: 'CHILD_CREATED',
      userId: user?.userId || user?.id,
      resource: 'CHILD',
      resourceId: child.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: child });
  } catch (error) {next(error);}
};exports.createChild = createChild;

const listChildren = async (req, res, next) => {
  try {
    const { page, limit, classId, parentId } = req.query;
    const skip = (page - 1) * limit;

    // For Parent and Teacher roles, limit queries to their authorized resources automatically
    const user = req.user;
    let finalParentId = parentId;
    if (user.role === 'PARENT') finalParentId = user.userId;

    const children = await childService.listChildren(skip, limit, classId, finalParentId);
    res.json({ data: children, meta: { page, limit } });
  } catch (error) {next(error);}
};exports.listChildren = listChildren;

const getChild = async (req, res, next) => {
  try {
    const child = await childService.getChildById(req.params.id);
    const user = req.user;
    await _AuditService.auditService.log({
      action: 'CHILD_ACCESSED',
      userId: user?.userId || user?.id,
      resource: 'CHILD',
      resourceId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.json({ data: child });
  } catch (error) {next(error);}
};exports.getChild = getChild;

const createClass = async (req, res, next) => {
  try {
    const cls = await classService.createClass(req.body);
    res.status(201).json({ data: cls });
  } catch (error) {next(error);}
};exports.createClass = createClass;

const listClasses = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const classes = await classService.listClasses(skip, limit);
    res.json({ data: classes, meta: { page, limit } });
  } catch (error) {next(error);}
};exports.listClasses = listClasses;