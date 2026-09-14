"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.OperationsRepository = void 0;var _prisma = require("../core/prisma");


class OperationsRepository {
  async upsertAttendance(data) {
    return _prisma.prisma.attendanceRecord.upsert({
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

  async getAttendance(childId, startDate, endDate) {
    const where = { childId };
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }
    return _prisma.prisma.attendanceRecord.findMany({ where, orderBy: { date: 'desc' } });
  }

  async createMeal(data) {
    return _prisma.prisma.mealRecord.create({
      data: {
        ...data,
        date: new Date(data.date)
      }
    });
  }

  async getMeals(childId, date) {
    return _prisma.prisma.mealRecord.findMany({
      where: { childId, date },
      orderBy: { date: 'desc' }
    });
  }

  async createActivity(data) {
    return _prisma.prisma.activityRecord.create({
      data: {
        ...data,
        date: new Date(data.date)
      }
    });
  }

  async getActivities(childId, date) {
    return _prisma.prisma.activityRecord.findMany({
      where: { childId, date },
      orderBy: { date: 'desc' }
    });
  }
}exports.OperationsRepository = OperationsRepository;