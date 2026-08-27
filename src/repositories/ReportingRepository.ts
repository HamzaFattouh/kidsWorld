import { prisma } from '../core/prisma';
import { Prisma } from '@prisma/client';

export class ReportingRepository {
  async createIncident(data: Prisma.IncidentUncheckedCreateInput) {
    return prisma.incident.create({ data });
  }

  async getIncidents(childId: string, isParent: boolean) {
    const where: any = { childId };
    if (isParent) {
      where.isVisibleToParent = true;
    }
    return prisma.incident.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async createWeeklyNote(data: Prisma.WeeklyNoteUncheckedCreateInput) {
    return prisma.weeklyNote.create({ data });
  }

  async getWeeklyNotes(childId: string) {
    return prisma.weeklyNote.findMany({ where: { childId }, orderBy: { weekStartDate: 'desc' } });
  }

  async createEvaluation(data: Prisma.EvaluationUncheckedCreateInput) {
    return prisma.evaluation.create({ data });
  }

  async getEvaluations(childId: string) {
    return prisma.evaluation.findMany({ where: { childId }, orderBy: { term: 'desc' } });
  }
}
