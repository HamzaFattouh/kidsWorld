import { prisma } from '../core/prisma';
import { Role } from '@prisma/client';

export class AuthzRepository {
  async hasPermission(role: Role, action: string): Promise<boolean> {
    const rolePermission = await prisma.rolePermission.findFirst({
      where: {
        role,
        permission: {
          action
        }
      }
    });
    return !!rolePermission;
  }

  async getParentChildrenIds(parentId: string): Promise<string[]> {
    const children = await prisma.child.findMany({
      where: { parentId },
      select: { id: true }
    });
    return children.map(c => c.id);
  }

  async getTeacherClassIds(teacherId: string): Promise<string[]> {
    const teacherClasses = await prisma.teacherClass.findMany({
      where: { teacherId },
      select: { classId: true }
    });
    return teacherClasses.map(tc => tc.classId);
  }

  async getChildClassId(childId: string): Promise<string | null> {
    const child = await prisma.child.findUnique({
      where: { id: childId },
      select: { classId: true }
    });
    return child?.classId || null;
  }

  async getCameraClassId(cameraId: string): Promise<string | null> {
    const camera = await prisma.camera.findUnique({
      where: { id: cameraId },
      select: { classId: true }
    });
    return camera?.classId || null;
  }

  // Get the childId associated with a generic resource
  async getResourceChildId(resourceType: 'document' | 'incident' | 'complaint', resourceId: string): Promise<string | null> {
    let resource;
    if (resourceType === 'document') {
      resource = await prisma.document.findUnique({ where: { id: resourceId }, select: { childId: true } });
    } else if (resourceType === 'incident') {
      resource = await prisma.incident.findUnique({ where: { id: resourceId }, select: { childId: true } });
    } else if (resourceType === 'complaint') {
      resource = await prisma.complaint.findUnique({ where: { id: resourceId }, select: { childId: true } });
    }
    return resource?.childId || null;
  }
}
