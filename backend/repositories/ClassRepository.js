"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.ClassRepository = void 0;var _prisma = require("../core/prisma");



class ClassRepository {
  async create(data) {
    return _prisma.prisma.class.create({ data });
  }

  async findById(id) {
    return _prisma.prisma.class.findUnique({
      where: { id },
      include: {
        teachers: { include: { teacher: true } },
        children: true
      }
    });
  }

  async findMany(options) {
    return _prisma.prisma.class.findMany({
      where: options.where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
      include: { _count: { select: { children: true } } }
    });
  }

  async assignTeacher(classId, teacherId) {
    return _prisma.prisma.teacherClass.create({
      data: { classId, teacherId }
    });
  }
}exports.ClassRepository = ClassRepository;