import { prisma } from '../core/prisma';
import { auditService } from './AuditService';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
// No Role

export class CameraService {
  
  // Get all active cameras a user is allowed to view
  async getAccessibleCameras(userId: string, role: any) {
    if (role === 'ADMIN') {
      return prisma.camera.findMany({ where: { isActive: true }, include: { schedules: true, class: true } });
    }

    if (role === 'TEACHER') {
      const teacherClasses = await prisma.teacherClass.findMany({ where: { teacherId: userId } });
      const classIds = teacherClasses.map((tc: any) => tc.classId);
      return prisma.camera.findMany({
        where: { classId: { in: classIds }, isActive: true },
        include: { schedules: true, class: true }
      });
    }

    if (role === 'PARENT') {
      const children = await prisma.child.findMany({ where: { parentId: userId } });
      const classIds = children.map((c: any) => c.classId);
      return prisma.camera.findMany({
        where: { classId: { in: classIds }, isActive: true },
        include: { schedules: true, class: true }
      });
    }

    return [];
  }

  // Request access token for a specific camera
  async requestCameraAccess(userId: string, role: any, cameraId: string, ipAddress: string) {
    // 1. Verify Camera Exists and is Active
    const camera = await prisma.camera.findUnique({
      where: { id: cameraId },
      include: { schedules: true, class: true }
    });

    if (!camera || !camera.isActive) {
      throw new Error('Camera is offline or does not exist');
    }

    // 2. Verify User Access to this specific camera
    const accessibleCameras = await this.getAccessibleCameras(userId, role);
    if (!accessibleCameras.find((c: any) => c.id === cameraId)) {
      await auditService.log({
        action: 'UNAUTHORIZED_CAMERA_ACCESS',
        userId,
        resource: 'CAMERA',
        resourceId: cameraId,
        ipAddress
      });
      throw new Error('Unauthorized to view this camera');
    }

    // 3. Verify Schedule Constraints (Bypass for ADMIN)
    if (role !== 'ADMIN') {
      const now = new Date();
      const currentDay = now.getDay(); // 0-6 (Sun-Sat)
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const activeSchedule = camera.schedules.find((s: any) => {
        if (!s.isActive || s.dayOfWeek !== currentDay) return false;
        
        const startParts = s.startTime.split(':').map(Number);
        const endParts = s.endTime.split(':').map(Number);
        const startMinutes = startParts[0] * 60 + startParts[1];
        const endMinutes = endParts[0] * 60 + endParts[1];

        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      });

      if (!activeSchedule) {
        throw new Error('Camera access is currently outside of scheduled hours');
      }
    }

    // 4. Generate Short-Lived JWT for Media Server Handshake
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const streamToken = jwt.sign(
      { sub: userId, cameraId, role },
      jwtSecret,
      { expiresIn: '5m' } // 5 minutes to initiate the handshake
    );

    const tokenHash = crypto.createHash('sha256').update(streamToken).digest('hex');

    // 5. Store Stream Session
    await prisma.streamSession.create({
      data: {
        userId,
        cameraId,
        tokenHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    });

    // 6. Audit Log
    await auditService.log({
      action: 'CAMERA_ACCESS_GRANTED',
      userId,
      resource: 'CAMERA',
      resourceId: cameraId,
      ipAddress
    });

    // We return the physical Media Server URL combined with the token
    const mediaServerUrl = process.env.MEDIA_SERVER_URL || 'http://localhost:8888';
    return {
      streamUrl: `${mediaServerUrl}/${camera.name}/stream.m3u8?token=${streamToken}`,
      webrtcUrl: `${mediaServerUrl}/${camera.name}/webrtc?token=${streamToken}`,
      expiresIn: 300
    };
  }
}

export const cameraService = new CameraService();
