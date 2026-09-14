"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.AuthzRepository = void 0;var _prisma = require("../core/prisma");


class AuthzRepository {
  async hasPermission(role, action) {
    const rolePermission = await _prisma.prisma.rolePermission.findFirst({
      where: {
        role,
        permission: {
          action
        }
      }
    });
    return !!rolePermission;
  }

  async getParentChildrenIds(parentId) {
    const children = await _prisma.prisma.child.findMany({
      where: { parentId },
      select: { id: true }
    });
    return children.map((c) => c.id);
  }

  async getTeacherClassIds(teacherId) {
    const teacherClasses = await _prisma.prisma.teacherClass.findMany({
      where: { teacherId },
      select: { classId: true }
    });
    return teacherClasses.map((tc) => tc.classId);
  }

  async getChildClassId(childId) {
    const child = await _prisma.prisma.child.findUnique({
      where: { id: childId },
      select: { classId: true }
    });
    return child?.classId || null;
  }

  async getCameraClassId(cameraId) {
    const camera = await _prisma.prisma.camera.findUnique({
      where: { id: cameraId },
      select: { classId: true }
    });
    return camera?.classId || null;
  }

  // Get the childId associated with a generic resource
  async getResourceChildId(resourceType, resourceId) {
    let resource;
    if (resourceType === 'document') {
      resource = await _prisma.prisma.document.findUnique({ where: { id: resourceId }, select: { childId: true } });
    } else if (resourceType === 'incident') {
      resource = await _prisma.prisma.incident.findUnique({ where: { id: resourceId }, select: { childId: true } });
    } else if (resourceType === 'complaint') {
      resource = await _prisma.prisma.complaint.findUnique({ where: { id: resourceId }, select: { childId: true } });
    }
    return resource?.childId || null;
  }
}exports.AuthzRepository = AuthzRepository;