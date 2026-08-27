import { ClassRepository } from '../repositories/ClassRepository';
import { Prisma } from '@prisma/client';

export class ClassService {
  constructor(private classRepo = new ClassRepository()) {}

  async createClass(data: Prisma.ClassUncheckedCreateInput) {
    return this.classRepo.create(data);
  }

  async getClassById(id: string) {
    return this.classRepo.findById(id);
  }

  async listClasses(skip = 0, take = 10) {
    return this.classRepo.findMany({ skip, take });
  }

  async assignTeacherToClass(classId: string, teacherId: string) {
    return this.classRepo.assignTeacher(classId, teacherId);
  }
}
