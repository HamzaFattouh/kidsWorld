import { ChildRepository } from '../repositories/ChildRepository';
import { ClassRepository } from '../repositories/ClassRepository';
import { ContactRepository } from '../repositories/ContactRepository';
import { ValidationError } from '../core/errors/AppError';
import { Prisma } from '@prisma/client';

export class ChildService {
  constructor(
    private childRepo = new ChildRepository(),
    private classRepo = new ClassRepository(),
    private contactRepo = new ContactRepository()
  ) {}

  async createChild(data: Prisma.ChildUncheckedCreateInput) {
    const classInfo = await this.classRepo.findById(data.classId);
    if (!classInfo) throw new ValidationError('Class not found');
    
    const count = await this.childRepo.countByClass(data.classId);
    if (count >= classInfo.capacity) throw new ValidationError('Class is at full capacity');

    return this.childRepo.create(data);
  }

  async getChildById(id: string) {
    return this.childRepo.findById(id);
  }

  async listChildren(skip = 0, take = 10, classId?: string, parentId?: string) {
    const where: any = {};
    if (classId) where.classId = classId;
    if (parentId) where.parentId = parentId;
    
    return this.childRepo.findMany({ skip, take, where });
  }

  async addEmergencyContact(data: Prisma.EmergencyContactUncheckedCreateInput) {
    return this.contactRepo.createEmergencyContact(data);
  }

  async addAuthorizedPickup(data: Prisma.AuthorizedPickupUncheckedCreateInput) {
    return this.contactRepo.createAuthorizedPickup(data);
  }
}
