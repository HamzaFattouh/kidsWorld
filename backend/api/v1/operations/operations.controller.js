"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.logMeal = exports.logAttendance = exports.logActivity = exports.getMeals = exports.getAttendance = exports.getActivities = void 0;
var _OperationsService = require("../../../services/OperationsService");

const opsService = new _OperationsService.OperationsService();

const logAttendance = async (req, res, next) => {
  try {
    const record = await opsService.logAttendance(req.body);
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.logAttendance = logAttendance;

const getAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const records = await opsService.getAttendance(req.params.childId, startDate, endDate);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getAttendance = getAttendance;

const logMeal = async (req, res, next) => {
  try {
    const record = await opsService.logMeal(req.body);
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.logMeal = logMeal;

const getMeals = async (req, res, next) => {
  try {
    const { date } = req.query;
    const records = await opsService.getMeals(req.params.childId, date);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getMeals = getMeals;

const logActivity = async (req, res, next) => {
  try {
    const record = await opsService.logActivity(req.body);
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.logActivity = logActivity;

const getActivities = async (req, res, next) => {
  try {
    const { date } = req.query;
    const records = await opsService.getActivities(req.params.childId, date);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getActivities = getActivities;