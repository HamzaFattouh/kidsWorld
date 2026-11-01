"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.cameraService = exports.CameraService = void 0;var _prisma = require("../core/prisma");
var _AuditService = require("./AuditService");
var _crypto = _interopRequireDefault(require("crypto"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
// No Role

class CameraService {

  // Get all active cameras a user is allowed to view
  async getAccessibleCameras(userId, role) {
    if (role === 'ADMIN') {
      return _prisma.prisma.camera.findMany({ where: { isActive: true }, include: { schedules: true, class: true } });
    }

    if (role === 'TEACHER') {
      const teacherClasses = await _prisma.prisma.teacherClass.findMany({ where: { teacherId: userId } });
      const classIds = teacherClasses.map((tc) => tc.classId);
      return _prisma.prisma.camera.findMany({
        where: { classId: { in: classIds }, isActive: true },
        include: { schedules: true, class: true }
      });
    }

    if (role === 'PARENT') {
      const children = await _prisma.prisma.child.findMany({ where: { parentId: userId } });
      const classIds = children.map((c) => c.classId);

      // Also include shared / common facilities (e.g. playroom, activities, playground)
      const sharedClasses = await _prisma.prisma.class.findMany({
        where: {
          OR: [
            { id: { in: ['class-playroom-1', 'class-playroom-2', 'class-playroom-3', 'class-activity', 'class-dining', 'class-playground', 'class-reception'] } },
            { ageGroup: { in: ['مشترك', 'عام', 'غرفة الألعاب'] } }
          ]
        }
      });
      const sharedClassIds = sharedClasses.map((c) => c.id);
      const allClassIds = Array.from(new Set([...classIds, ...sharedClassIds]));

      return _prisma.prisma.camera.findMany({
        where: { classId: { in: allClassIds }, isActive: true },
        include: { schedules: true, class: true }
      });
    }

    return [];
  }

  // Request access token for a specific camera
  async requestCameraAccess(userId, role, cameraId, ipAddress) {
    // 1. Verify Camera Exists and is Active
    const camera = await _prisma.prisma.camera.findUnique({
      where: { id: cameraId },
      include: { schedules: true, class: true }
    });

    if (!camera || !camera.isActive) {
      throw new Error('Camera is offline or does not exist');
    }

    // 2. Verify User Access to this specific camera
    const accessibleCameras = await this.getAccessibleCameras(userId, role);
    if (!accessibleCameras.find((c) => c.id === cameraId)) {
      await _AuditService.auditService.log({
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

      const activeSchedule = camera.schedules.find((s) => {
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
    const streamToken = _jsonwebtoken.default.sign(
      { sub: userId, cameraId, role },
      jwtSecret,
      { expiresIn: '5m' } // 5 minutes to initiate the handshake
    );

    const tokenHash = _crypto.default.createHash('sha256').update(streamToken).digest('hex');

    // 5. Store Stream Session
    await _prisma.prisma.streamSession.create({
      data: {
        userId,
        cameraId,
        tokenHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    });

    // 6. Audit Log
    await _AuditService.auditService.log({
      action: 'CAMERA_ACCESS_GRANTED',
      userId,
      resource: 'CAMERA',
      resourceId: cameraId,
      ipAddress
    });

    // 7. Resolve go2rtc stream key (cam1..cam7)
    const mediaServerUrl = process.env.MEDIA_SERVER_URL || 'https://stream.yourdomain.com';
    let streamKey = 'cam1';
    if (camera.streamUrl && /^cam[1-7]$/i.test(camera.streamUrl.trim())) {
      streamKey = camera.streamUrl.trim().toLowerCase();
    } else if (camera.name && camera.name.toLowerCase().match(/cam[1-7]/)) {
      streamKey = camera.name.toLowerCase().match(/cam[1-7]/)[0];
    } else if (camera.id && camera.id.match(/cam-([1-7])/)) {
      streamKey = 'cam' + camera.id.match(/cam-([1-7])/)[1];
    }

    const wsUrl = mediaServerUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');

    return {
      cameraId: camera.id,
      cameraName: camera.name,
      className: camera.class?.name || 'قاعة عامة',
      streamKey,
      token: streamToken,
      mediaServerUrl,
      // go2rtc WebRTC endpoints
      webrtcOfferUrl: `${mediaServerUrl}/api/webrtc?src=${streamKey}&token=${streamToken}`,
      webrtcWsUrl: `${wsUrl}/api/ws?src=${streamKey}&token=${streamToken}`,
      hlsUrl: `${mediaServerUrl}/api/stream.m3u8?src=${streamKey}&token=${streamToken}`,
      // Backward compatibility for existing tests
      webrtcUrl: `${mediaServerUrl}/${camera.name}/webrtc?token=${streamToken}`,
      streamUrl: `${mediaServerUrl}/${camera.name}/stream.m3u8?token=${streamToken}`,
      expiresIn: 300
    };
  }
}exports.CameraService = CameraService;

const cameraService = exports.cameraService = new CameraService();