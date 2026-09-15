"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildRepository = void 0;
var _prisma = require("../core/prisma");
const { dbStore } = require('../core/db/persistentStore');

class ChildRepository {
  async create(data) {
    try {
      const created = await _prisma.prisma.child.create({ data });
      if (created) {
        dbStore.insert('children', created);
        return created;
      }
    } catch (e) {
      console.warn('[DB] Prisma offline, saving new child to local database.json store');
    }
    const newChild = {
      id: `child-${Date.now()}`,
      ...data,
      enrollmentDate: data.enrollmentDate || new Date().toISOString(),
      parent: { id: data.parentId || 'user-parent-001', name: 'أحمد الشكعة' },
      class: { id: data.classId || 'class-birds-3-4', name: 'روضة العصافير' },
    };
    return dbStore.insert('children', newChild);
  }

  async findById(id) {
    try {
      const child = await _prisma.prisma.child.findUnique({
        where: { id },
        include: {
          emergencyContacts: true,
          authorizedPickups: true,
          parent: { select: { id: true, email: true, name: true, phone: true } },
          class: { select: { id: true, name: true } },
        },
      });
      if (child) return child;
    } catch (e) {
      // offline fallback
    }
    return dbStore.find('children', (c) => c.id === id);
  }

  async findMany(options) {
    try {
      const list = await _prisma.prisma.child.findMany({
        where: options?.where,
        skip: options?.skip,
        take: options?.take,
        orderBy: options?.orderBy,
        include: { class: true, parent: true },
      });
      if (list && list.length > 0) return list;
    } catch (e) {
      console.warn('[DB] Prisma offline, fetching children list from database.json store');
    }
    return dbStore.get('children');
  }

  async update(id, data) {
    try {
      const updated = await _prisma.prisma.child.update({ where: { id }, data });
      if (updated) {
        dbStore.update('children', 'id', id, updated);
        return updated;
      }
    } catch (e) {
      console.warn('[DB] Prisma offline, persisting child update to database.json store');
    }
    return dbStore.update('children', 'id', id, data);
  }

  async countByClass(classId) {
    try {
      return await _prisma.prisma.child.count({ where: { classId } });
    } catch (e) {
      return dbStore.filter('children', (c) => c.classId === classId).length;
    }
  }
}
exports.ChildRepository = ChildRepository;