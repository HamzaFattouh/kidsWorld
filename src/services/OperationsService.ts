import { OperationsRepository } from '../repositories/OperationsRepository';
import { Prisma } from '@prisma/client';

export class OperationsService {
  constructor(private opsRepo = new OperationsRepository()) {}

  async logAttendance(data: Prisma.AttendanceRecordUncheckedCreateInput) {
    return this.opsRepo.upsertAttendance(data);
  }

  async getAttendance(childId: string, startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.opsRepo.getAttendance(childId, start, end);
  }

  async logMeal(data: Prisma.MealRecordUncheckedCreateInput) {
    return this.opsRepo.createMeal(data);
  }

  async getMeals(childId: string, date: string) {
    return this.opsRepo.getMeals(childId, new Date(date));
  }

  async logActivity(data: Prisma.ActivityRecordUncheckedCreateInput) {
    return this.opsRepo.createActivity(data);
  }

  async getActivities(childId: string, date: string) {
    return this.opsRepo.getActivities(childId, new Date(date));
  }
}
