"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.ReportingRepository = void 0;var _prisma = require("../core/prisma");


class ReportingRepository {
  async createIncident(data) {
    return _prisma.prisma.incident.create({ data });
  }

  async getIncidents(childId, isParent) {
    const where = { childId };
    if (isParent) {
      where.isVisibleToParent = true;
    }
    return _prisma.prisma.incident.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async createWeeklyNote(data) {
    return _prisma.prisma.weeklyNote.create({ data });
  }

  async getWeeklyNotes(childId) {
    return _prisma.prisma.weeklyNote.findMany({ where: { childId }, orderBy: { weekStartDate: 'desc' } });
  }

  async createEvaluation(data) {
    return _prisma.prisma.evaluation.create({ data });
  }

  async getEvaluations(childId) {
    return _prisma.prisma.evaluation.findMany({ where: { childId }, orderBy: { term: 'desc' } });
  }
}exports.ReportingRepository = ReportingRepository;