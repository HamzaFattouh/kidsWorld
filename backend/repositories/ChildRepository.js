"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.ChildRepository = void 0;var _prisma = require("../core/prisma");









class ChildRepository {
  async create(data) {
    return _prisma.prisma.child.create({ data });
  }

  async findById(id) {
    return _prisma.prisma.child.findUnique({
      where: { id },
      include: {
        emergencyContacts: true,
        authorizedPickups: true,
        parent: { select: { id: true, email: true } },
        class: { select: { id: true, name: true } }
      }
    });
  }

  async findMany(options) {
    return _prisma.prisma.child.findMany({
      where: options.where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
      include: { class: true }
    });
  }

  async update(id, data) {
    return _prisma.prisma.child.update({ where: { id }, data });
  }

  async countByClass(classId) {
    return _prisma.prisma.child.count({ where: { classId } });
  }
}exports.ChildRepository = ChildRepository;