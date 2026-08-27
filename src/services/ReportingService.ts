import { ReportingRepository } from '../repositories/ReportingRepository';
import { Prisma } from '@prisma/client';

export class ReportingService {
  constructor(private reportingRepo = new ReportingRepository()) {}

  async createIncident(data: Prisma.IncidentUncheckedCreateInput) {
    return this.reportingRepo.createIncident(data);
  }

  async getIncidents(childId: string, role: string) {
    const isParent = role === 'PARENT';
    return this.reportingRepo.getIncidents(childId, isParent);
  }

  async createWeeklyNote(data: Prisma.WeeklyNoteUncheckedCreateInput) {
    return this.reportingRepo.createWeeklyNote(data);
  }

  async getWeeklyNotes(childId: string) {
    return this.reportingRepo.getWeeklyNotes(childId);
  }

  async createEvaluation(data: Prisma.EvaluationUncheckedCreateInput) {
    // Basic validation could happen here, but Zod schema will handle strictly 1-5 validation
    return this.reportingRepo.createEvaluation(data);
  }

  async getEvaluations(childId: string) {
    return this.reportingRepo.getEvaluations(childId);
  }
}
