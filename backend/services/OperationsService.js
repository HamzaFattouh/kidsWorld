"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.OperationsService = void 0;var _OperationsRepository = require("../repositories/OperationsRepository");


class OperationsService {
  constructor(opsRepo = new _OperationsRepository.OperationsRepository()) {this.opsRepo = opsRepo;}

  async logAttendance(data) {
    return this.opsRepo.upsertAttendance(data);
  }

  async getAttendance(childId, startDate, endDate) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.opsRepo.getAttendance(childId, start, end);
  }

  async logMeal(data) {
    return this.opsRepo.createMeal(data);
  }

  async getMeals(childId, date) {
    return this.opsRepo.getMeals(childId, new Date(date));
  }

  async logActivity(data) {
    return this.opsRepo.createActivity(data);
  }

  async getActivities(childId, date) {
    return this.opsRepo.getActivities(childId, new Date(date));
  }
}exports.OperationsService = OperationsService;