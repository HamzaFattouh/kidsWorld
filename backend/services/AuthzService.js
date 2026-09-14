"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.AuthzService = void 0;var _AuthzRepository = require("../repositories/AuthzRepository");
var _client = require("@prisma/client");

class AuthzService {
  constructor(authzRepo = new _AuthzRepository.AuthzRepository()) {this.authzRepo = authzRepo;}

  async checkPermission(role, action) {
    // Admins have all permissions by default
    if (role === _client.Role.ADMIN) return true;
    return this.authzRepo.hasPermission(role, action);
  }

  async checkOwnership(role, userId, resourceType, resourceId) {
    if (role === _client.Role.ADMIN) return true; // Admin has access to all resources

    if (resourceType === 'child') {
      if (role === _client.Role.PARENT) {
        const childrenIds = await this.authzRepo.getParentChildrenIds(userId);
        return childrenIds.includes(resourceId);
      }
      if (role === _client.Role.TEACHER) {
        const classId = await this.authzRepo.getChildClassId(resourceId);
        if (!classId) return false;
        const teacherClassIds = await this.authzRepo.getTeacherClassIds(userId);
        return teacherClassIds.includes(classId);
      }
    }

    if (resourceType === 'camera') {
      const classId = await this.authzRepo.getCameraClassId(resourceId);
      if (!classId) return false;

      if (role === _client.Role.PARENT) {
        // Parent can view camera if their child is in that class
        const childrenIds = await this.authzRepo.getParentChildrenIds(userId);
        for (const childId of childrenIds) {
          const childClassId = await this.authzRepo.getChildClassId(childId);
          if (childClassId === classId) return true;
        }
        return false;
      }

      if (role === _client.Role.TEACHER) {
        const teacherClassIds = await this.authzRepo.getTeacherClassIds(userId);
        return teacherClassIds.includes(classId);
      }
    }

    if (['document', 'incident', 'complaint'].includes(resourceType)) {
      const childId = await this.authzRepo.getResourceChildId(resourceType, resourceId);
      if (!childId) return false;

      if (role === _client.Role.PARENT) {
        const childrenIds = await this.authzRepo.getParentChildrenIds(userId);
        return childrenIds.includes(childId);
      }
      if (role === _client.Role.TEACHER) {
        const classId = await this.authzRepo.getChildClassId(childId);
        if (!classId) return false;
        const teacherClassIds = await this.authzRepo.getTeacherClassIds(userId);
        return teacherClassIds.includes(classId);
      }
    }

    return false;
  }
}exports.AuthzService = AuthzService;