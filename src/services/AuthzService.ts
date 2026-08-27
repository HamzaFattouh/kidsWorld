import { AuthzRepository } from '../repositories/AuthzRepository';
import { Role } from '@prisma/client';

export class AuthzService {
  constructor(private authzRepo = new AuthzRepository()) {}

  async checkPermission(role: Role, action: string): Promise<boolean> {
    // Admins have all permissions by default
    if (role === Role.ADMIN) return true;
    return this.authzRepo.hasPermission(role, action);
  }

  async checkOwnership(role: Role, userId: string, resourceType: string, resourceId: string): Promise<boolean> {
    if (role === Role.ADMIN) return true; // Admin has access to all resources

    if (resourceType === 'child') {
      if (role === Role.PARENT) {
        const childrenIds = await this.authzRepo.getParentChildrenIds(userId);
        return childrenIds.includes(resourceId);
      }
      if (role === Role.TEACHER) {
        const classId = await this.authzRepo.getChildClassId(resourceId);
        if (!classId) return false;
        const teacherClassIds = await this.authzRepo.getTeacherClassIds(userId);
        return teacherClassIds.includes(classId);
      }
    }

    if (resourceType === 'camera') {
      const classId = await this.authzRepo.getCameraClassId(resourceId);
      if (!classId) return false;
      
      if (role === Role.PARENT) {
        // Parent can view camera if their child is in that class
        const childrenIds = await this.authzRepo.getParentChildrenIds(userId);
        for (const childId of childrenIds) {
          const childClassId = await this.authzRepo.getChildClassId(childId);
          if (childClassId === classId) return true;
        }
        return false;
      }
      
      if (role === Role.TEACHER) {
        const teacherClassIds = await this.authzRepo.getTeacherClassIds(userId);
        return teacherClassIds.includes(classId);
      }
    }

    if (['document', 'incident', 'complaint'].includes(resourceType)) {
      const childId = await this.authzRepo.getResourceChildId(resourceType as any, resourceId);
      if (!childId) return false;

      if (role === Role.PARENT) {
        const childrenIds = await this.authzRepo.getParentChildrenIds(userId);
        return childrenIds.includes(childId);
      }
      if (role === Role.TEACHER) {
        const classId = await this.authzRepo.getChildClassId(childId);
        if (!classId) return false;
        const teacherClassIds = await this.authzRepo.getTeacherClassIds(userId);
        return teacherClassIds.includes(classId);
      }
    }

    return false;
  }
}
