import { prisma } from '../core/prisma';
import { Prisma } from '@prisma/client';

export interface QueryOptions {
  skip?: number;
  take?: number;
  orderBy?: any;
  where?: any;
}

export class ChildRepository {
  async create(data: Prisma.ChildUncheckedCreateInput) {
    return prisma.child.create({ data });
  }

  async findById(id: string) {
    return prisma.child.findUnique({
      where: { id },
      include: {
        emergencyContacts: true,
        authorizedPickups: true,
        parent: { select: { id: true, email: true } },
        class: { select: { id: true, name: true } }
      }
    });
  }

  async findMany(options: QueryOptions) {
    return prisma.child.findMany({
      where: options.where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
      include: { class: true }
    });
  }

  async update(id: string, data: Prisma.ChildUncheckedUpdateInput) {
    return prisma.child.update({ where: { id }, data });
  }

  async countByClass(classId: string) {
    return prisma.child.count({ where: { classId } });
  }
}
