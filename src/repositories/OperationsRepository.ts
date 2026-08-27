import { prisma } from '../core/prisma';
import { Prisma } from '@prisma/client';

export class OperationsRepository {
  async upsertAttendance(data: Prisma.AttendanceRecordUncheckedCreateInput) {
    return prisma.attendanceRecord.upsert({
      where: {
        childId_date: {
          childId: data.childId,
          date: new Date(data.date)
        }
      },
      update: {
        status: data.status,
        notes: data.notes
      },
      create: {
        childId: data.childId,
        date: new Date(data.date),
        status: data.status,
        notes: data.notes
      }
    });
  }

  async getAttendance(childId: string, startDate?: Date, endDate?: Date) {
    const where: any = { childId };
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }
    return prisma.attendanceRecord.findMany({ where, orderBy: { date: 'desc' } });
  }

  async createMeal(data: Prisma.MealRecordUncheckedCreateInput) {
    return prisma.mealRecord.create({
      data: {
        ...data,
        date: new Date(data.date)
      }
    });
  }

  async getMeals(childId: string, date: Date) {
    return prisma.mealRecord.findMany({
      where: { childId, date },
      orderBy: { date: 'desc' }
    });
  }

  async createActivity(data: Prisma.ActivityRecordUncheckedCreateInput) {
    return prisma.activityRecord.create({
      data: {
        ...data,
        date: new Date(data.date)
      }
    });
  }

  async getActivities(childId: string, date: Date) {
    return prisma.activityRecord.findMany({
      where: { childId, date },
      orderBy: { date: 'desc' }
    });
  }
}
