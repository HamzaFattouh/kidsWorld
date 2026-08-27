import { prisma } from '../core/prisma';
import { Prisma } from '@prisma/client';
import { QueryOptions } from './ChildRepository';

export class ClassRepository {
  async create(data: Prisma.ClassUncheckedCreateInput) {
    return prisma.class.create({ data });
  }

  async findById(id: string) {
    return prisma.class.findUnique({
      where: { id },
      include: {
        teachers: { include: { teacher: true } },
        children: true
      }
    });
  }

  async findMany(options: QueryOptions) {
    return prisma.class.findMany({
      where: options.where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
      include: { _count: { select: { children: true } } }
    });
  }

  async assignTeacher(classId: string, teacherId: string) {
    return prisma.teacherClass.create({
      data: { classId, teacherId }
    });
  }
}
