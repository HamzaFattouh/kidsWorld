"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.ReportingService = void 0;var _ReportingRepository = require("../repositories/ReportingRepository");


class ReportingService {
  constructor(reportingRepo = new _ReportingRepository.ReportingRepository()) {this.reportingRepo = reportingRepo;}

  async createIncident(data) {
    return this.reportingRepo.createIncident(data);
  }

  async getIncidents(childId, role) {
    const isParent = role === 'PARENT';
    return this.reportingRepo.getIncidents(childId, isParent);
  }

  async createWeeklyNote(data) {
    return this.reportingRepo.createWeeklyNote(data);
  }

  async getWeeklyNotes(childId) {
    return this.reportingRepo.getWeeklyNotes(childId);
  }

  async createEvaluation(data) {
    // Basic validation could happen here, but Zod schema will handle strictly 1-5 validation
    return this.reportingRepo.createEvaluation(data);
  }

  async getEvaluations(childId) {
    return this.reportingRepo.getEvaluations(childId);
  }
}exports.ReportingService = ReportingService;