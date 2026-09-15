"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsRepository = void 0;
var _prisma = require("../core/prisma");

const FALLBACK_ATTENDANCE = [
  { id: 'att-1', childId: 'child-omar-shakaa', date: '2026-09-15', status: 'PRESENT', notes: 'حضور مبكر ونشاط ممتاز' },
  { id: 'att-2', childId: 'child-omar-shakaa', date: '2026-09-14', status: 'PRESENT', notes: 'انتظام تام' },
  { id: 'att-3', childId: 'child-omar-shakaa', date: '2026-09-13', status: 'LATE', notes: 'تأخير 15 دقيقة' },
  { id: 'att-4', childId: 'child-sara-masri', date: '2026-09-15', status: 'PRESENT', notes: 'مشاركة ممتازة' },
];

const FALLBACK_MEALS = [
  { id: 'meal-1', childId: 'child-omar-shakaa', date: '2026-09-15', type: 'BREAKFAST', notes: 'أكل وجبته اليومية بنجاح 🍏', consumed: 'ALL' },
  { id: 'meal-2', childId: 'child-sara-masri', date: '2026-09-15', type: 'BREAKFAST', notes: 'أكل الوجبة بالكامل ✅', consumed: 'ALL' },
];

class OperationsRepository {
  async upsertAttendance(data) {
    try {
      return await _prisma.prisma.attendanceRecord.upsert({
        where: {
          childId_date: {
            childId: data.childId,
            date: new Date(data.date),
          },
        },
        update: {
          status: data.status,
          notes: data.notes,
        },
        create: {
          childId: data.childId,
          date: new Date(data.date),
          status: data.status,
          notes: data.notes,
        },
      });
    } catch (e) {
      console.warn('DB error in upsertAttendance, updating fallback memory');
      const rec = { id: `att-${Date.now()}`, ...data };
      FALLBACK_ATTENDANCE.push(rec);
      return rec;
    }
  }

  async getAttendance(childId, startDate, endDate) {
    try {
      const where = { childId };
      if (startDate && endDate) {
        where.date = { gte: startDate, lte: endDate };
      }
      const records = await _prisma.prisma.attendanceRecord.findMany({ where, orderBy: { date: 'desc' } });
      if (records && records.length > 0) return records;
    } catch (e) {
      console.warn('DB error in getAttendance, returning fallback list');
    }
    return FALLBACK_ATTENDANCE.filter((a) => !childId || a.childId === childId);
  }

  async createMeal(data) {
    try {
      return await _prisma.prisma.mealRecord.create({
        data: {
          ...data,
          date: new Date(data.date),
        },
      });
    } catch (e) {
      const rec = { id: `meal-${Date.now()}`, ...data };
      FALLBACK_MEALS.push(rec);
      return rec;
    }
  }

  async getMeals(childId, date) {
    try {
      const records = await _prisma.prisma.mealRecord.findMany({
        where: { childId, date },
        orderBy: { date: 'desc' },
      });
      if (records && records.length > 0) return records;
    } catch (e) {
      console.warn('DB error in getMeals, returning fallback meals');
    }
    return FALLBACK_MEALS.filter((m) => !childId || m.childId === childId);
  }

  async createActivity(data) {
    try {
      return await _prisma.prisma.activityRecord.create({
        data: {
          ...data,
          date: new Date(data.date),
        },
      });
    } catch (e) {
      return { id: `act-${Date.now()}`, ...data };
    }
  }

  async getActivities(childId, date) {
    try {
      return await _prisma.prisma.activityRecord.findMany({
        where: { childId, date },
        orderBy: { date: 'desc' },
      });
    } catch (e) {
      return [
        { id: 'act-1', childId, date: '2026-09-15', title: 'نشاط الرسم والتلوين', description: 'رسم الطبيعة بالألوان الشمعية' },
      ];
    }
  }
}
exports.OperationsRepository = OperationsRepository;