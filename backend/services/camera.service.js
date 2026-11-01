"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cameraService = exports.CameraService = void 0;

var _prisma = require("../core/prisma");
var _AuditService = require("./AuditService");
var _crypto = _interopRequireDefault(require("crypto"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
const { dbStore } = require('../core/db/persistentStore');

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}

// 7 Standard Nursery Cameras: 4 Sleep Rooms + 3 Playroom Angles
const SEED_CAMERAS = [
  {
    id: 'cam-sleep-1',
    name: 'غرفة نوم الأطفال (عمر سنة)',
    streamUrl: 'cam1',
    classId: 'class-sleep-1',
    isActive: true,
    class: { id: 'class-sleep-1', name: 'قسم الرضّع (سنة واحدة)', ageGroup: 'سنة واحدة' },
    schedules: [
      { dayOfWeek: 0, startTime: '11:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 1, startTime: '11:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 2, startTime: '11:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 3, startTime: '11:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 4, startTime: '11:30', endTime: '14:30', isActive: true }
    ]
  },
  {
    id: 'cam-sleep-2',
    name: 'غرفة نوم الأطفال (عمر سنتين)',
    streamUrl: 'cam2',
    classId: 'class-sleep-2',
    isActive: true,
    class: { id: 'class-sleep-2', name: 'قسم الصغار (سنتين)', ageGroup: 'سنتين' },
    schedules: [
      { dayOfWeek: 0, startTime: '12:00', endTime: '14:30', isActive: true },
      { dayOfWeek: 1, startTime: '12:00', endTime: '14:30', isActive: true },
      { dayOfWeek: 2, startTime: '12:00', endTime: '14:30', isActive: true },
      { dayOfWeek: 3, startTime: '12:00', endTime: '14:30', isActive: true },
      { dayOfWeek: 4, startTime: '12:00', endTime: '14:30', isActive: true }
    ]
  },
  {
    id: 'cam-sleep-3',
    name: 'غرفة نوم الأطفال (عمر 3 سنوات)',
    streamUrl: 'cam3',
    classId: 'class-sleep-3',
    isActive: true,
    class: { id: 'class-sleep-3', name: 'قسم البراعم (3 سنوات)', ageGroup: '3 سنوات' },
    schedules: [
      { dayOfWeek: 0, startTime: '12:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 1, startTime: '12:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 2, startTime: '12:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 3, startTime: '12:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 4, startTime: '12:30', endTime: '14:30', isActive: true }
    ]
  },
  {
    id: 'cam-sleep-4',
    name: 'غرفة نوم الأطفال (عمر 4 سنوات)',
    streamUrl: 'cam4',
    classId: 'class-sleep-4',
    isActive: true,
    class: { id: 'class-sleep-4', name: 'قسم الروضة (4 سنوات)', ageGroup: '4 سنوات' },
    schedules: [
      { dayOfWeek: 0, startTime: '13:00', endTime: '14:30', isActive: true },
      { dayOfWeek: 1, startTime: '13:00', endTime: '14:30', isActive: true },
      { dayOfWeek: 2, startTime: '13:00', endTime: '14:30', isActive: true },
      { dayOfWeek: 3, startTime: '13:00', endTime: '14:30', isActive: true },
      { dayOfWeek: 4, startTime: '13:00', endTime: '14:30', isActive: true }
    ]
  },
  {
    id: 'cam-play-1',
    name: 'غرفة الألعاب (الأنشطة الحركية والتسلق)',
    streamUrl: 'cam5',
    classId: 'class-playroom-1',
    isActive: true,
    class: { id: 'class-playroom-1', name: 'غرفة الألعاب (الأنشطة الحركية)', ageGroup: 'مشترك' },
    schedules: [
      { dayOfWeek: 0, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 1, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 2, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 3, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 4, startTime: '07:30', endTime: '14:30', isActive: true }
    ]
  },
  {
    id: 'cam-play-2',
    name: 'غرفة الألعاب (الألعاب الهادئة والرسم)',
    streamUrl: 'cam6',
    classId: 'class-playroom-2',
    isActive: true,
    class: { id: 'class-playroom-2', name: 'غرفة الألعاب (الرسم والمكعبات)', ageGroup: 'مشترك' },
    schedules: [
      { dayOfWeek: 0, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 1, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 2, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 3, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 4, startTime: '07:30', endTime: '14:30', isActive: true }
    ]
  },
  {
    id: 'cam-play-3',
    name: 'غرفة الألعاب (الساحة المركزية)',
    streamUrl: 'cam7',
    classId: 'class-playroom-3',
    isActive: true,
    class: { id: 'class-playroom-3', name: 'غرفة الألعاب (الساحة المركزية)', ageGroup: 'مشترك' },
    schedules: [
      { dayOfWeek: 0, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 1, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 2, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 3, startTime: '07:30', endTime: '14:30', isActive: true },
      { dayOfWeek: 4, startTime: '07:30', endTime: '14:30', isActive: true }
    ]
  }
];

class CameraService {
  constructor() {
    // Ensure cameras collection exists in persistent store
    const existing = dbStore.get('cameras');
    if (!existing || existing.length === 0) {
      dbStore.set('cameras', SEED_CAMERAS);
    }
  }

  // Helper: Retrieve all cameras (tries Prisma then falls back to dbStore)
  async getAllCameras() {
    try {
      const cameras = await _prisma.prisma.camera.findMany({
        include: { schedules: true, class: true }
      });
      if (cameras && cameras.length > 0) {
        return cameras;
      }
    } catch (e) {
      // Prisma offline or connection issue -> fallback
    }
    return dbStore.get('cameras') || SEED_CAMERAS;
  }

  // Helper: Check if camera is considered Playroom / common
  isPlayroomCamera(camera) {
    const name = camera.name || '';
    const classId = camera.classId || '';
    const streamUrl = (camera.streamUrl || '').toLowerCase();
    return (
      name.includes('ألعاب') ||
      name.includes('أنشطة') ||
      name.includes('مشترك') ||
      classId.includes('playroom') ||
      classId.includes('activity') ||
      ['cam5', 'cam6', 'cam7'].includes(streamUrl)
    );
  }

  // Helper: Get user overrides from persistent store
  getUserOverrides(userId) {
    const allOverrides = dbStore.get('cameraPermissions') || {};
    return allOverrides[userId] || {};
  }

  // Update user overrides in persistent store
  setUserOverrides(userId, overrides) {
    const allOverrides = dbStore.get('cameraPermissions') || {};
    allOverrides[userId] = { ...(allOverrides[userId] || {}), ...overrides };
    dbStore.set('cameraPermissions', allOverrides);
    return allOverrides[userId];
  }

  // Reset user overrides
  resetUserOverrides(userId) {
    const allOverrides = dbStore.get('cameraPermissions') || {};
    delete allOverrides[userId];
    dbStore.set('cameraPermissions', allOverrides);
    return {};
  }

  // Update camera details & embedded schedule
  async updateCamera(cameraId, updateData) {
    const { name, streamUrl, classId, isActive, schedule, orderIndex } = updateData;

    // 1. Update in persistent store
    const cameras = dbStore.get('cameras') || SEED_CAMERAS;
    const idx = cameras.findIndex((c) => c.id === cameraId);
    let updatedCam = null;

    if (idx !== -1) {
      cameras[idx] = {
        ...cameras[idx],
        ...(name !== undefined && { name }),
        ...(streamUrl !== undefined && { streamUrl }),
        ...(classId !== undefined && { classId }),
        ...(isActive !== undefined && { isActive }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(schedule !== undefined && {
          scheduleConfig: schedule,
          schedules: [
            {
              dayOfWeek: 0,
              startTime: schedule.startTime || '07:30',
              endTime: schedule.endTime || '14:30',
              isActive: !schedule.forceLocked
            },
            {
              dayOfWeek: 1,
              startTime: schedule.startTime || '07:30',
              endTime: schedule.endTime || '14:30',
              isActive: !schedule.forceLocked
            },
            {
              dayOfWeek: 2,
              startTime: schedule.startTime || '07:30',
              endTime: schedule.endTime || '14:30',
              isActive: !schedule.forceLocked
            },
            {
              dayOfWeek: 3,
              startTime: schedule.startTime || '07:30',
              endTime: schedule.endTime || '14:30',
              isActive: !schedule.forceLocked
            },
            {
              dayOfWeek: 4,
              startTime: schedule.startTime || '07:30',
              endTime: schedule.endTime || '14:30',
              isActive: !schedule.forceLocked
            }
          ]
        })
      };
      updatedCam = cameras[idx];
      dbStore.set('cameras', cameras);
    }

    // 2. Sync to Prisma if available
    try {
      await _prisma.prisma.camera.update({
        where: { id: cameraId },
        data: {
          ...(name && { name }),
          ...(streamUrl && { streamUrl }),
          ...(classId && { classId }),
          ...(isActive !== undefined && { isActive })
        }
      });

      if (schedule) {
        await _prisma.prisma.cameraSchedule.deleteMany({ where: { cameraId } });
        const days = schedule.daysOfWeek || [0, 1, 2, 3, 4];
        for (const day of days) {
          await _prisma.prisma.cameraSchedule.create({
            data: {
              cameraId,
              dayOfWeek: day,
              startTime: schedule.startTime || '07:30',
              endTime: schedule.endTime || '14:30',
              isActive: !schedule.forceLocked
            }
          });
        }
      }
    } catch (e) {
      // Prisma offline, persistent store succeeded
    }

    return updatedCam || { id: cameraId, ...updateData };
  }

  // Get Accessible Cameras for a User with default rules + explicit overrides
  async getAccessibleCameras(userId, role) {
    const allCameras = await this.getAllCameras();
    const activeCameras = allCameras.filter((c) => c.isActive);

    // 1. Admin gets all cameras unless explicit DENY
    if (role === 'ADMIN') {
      const overrides = this.getUserOverrides(userId);
      return activeCameras.filter((cam) => overrides[cam.id] !== 'DENY');
    }

    // 2. Retrieve user's children / assigned classes
    let userClassIds = [];
    try {
      if (role === 'PARENT') {
        const children = await _prisma.prisma.child.findMany({ where: { parentId: userId } });
        userClassIds = children.map((c) => c.classId);
      } else if (role === 'TEACHER') {
        const teacherClasses = await _prisma.prisma.teacherClass.findMany({ where: { teacherId: userId } });
        userClassIds = teacherClasses.map((tc) => tc.classId);
      }
    } catch (e) {
      // Fallback to dbStore
      if (role === 'PARENT') {
        const children = dbStore.filter('children', (c) => c.parentId === userId);
        userClassIds = children.map((c) => c.classId);
      } else if (role === 'TEACHER') {
        const teacher = dbStore.find('users', (u) => u.id === userId);
        if (teacher && teacher.assignedClass) {
          userClassIds = [teacher.assignedClass];
        }
      }
    }

    // 3. User overrides map
    const overrides = this.getUserOverrides(userId);

    // 4. Filter cameras according to:
    // - Explicit ALLOW -> always allowed
    // - Explicit DENY -> always forbidden
    // - Default: Child's class room + Playroom cameras
    return activeCameras.filter((cam) => {
      const override = overrides[cam.id];

      // Explicit Deny takes absolute precedence
      if (override === 'DENY') return false;

      // Explicit Allow grants access
      if (override === 'ALLOW') return true;

      // Default logic: Playroom is shared for all parents/teachers
      if (this.isPlayroomCamera(cam)) return true;

      // Default logic: Camera belonging to child's classroom or teacher's classroom
      if (cam.classId && userClassIds.includes(cam.classId)) return true;

      // Age group matching (e.g. class-sleep-1 vs 1 year)
      const matchesChildClass = userClassIds.some((cid) => {
        if (!cid) return false;
        if (cid === cam.classId) return true;
        if (cid.includes('sleep-1') && cam.id.includes('sleep-1')) return true;
        if (cid.includes('sleep-2') && cam.id.includes('sleep-2')) return true;
        if (cid.includes('sleep-3') && cam.id.includes('sleep-3')) return true;
        if (cid.includes('sleep-4') && cam.id.includes('sleep-4')) return true;
        if (cid.includes('hope') && (cam.id.includes('sleep-1') || cam.id.includes('sleep-2'))) return true;
        if (cid.includes('birds') && cam.id.includes('sleep-3')) return true;
        if (cid.includes('flowers') && cam.id.includes('sleep-4')) return true;
        return false;
      });

      return matchesChildClass;
    });
  }

  // Request Access Token for a Camera
  async requestCameraAccess(userId, role, cameraId, ipAddress) {
    const allCameras = await this.getAllCameras();
    const camera = allCameras.find((c) => c.id === cameraId);

    if (!camera || !camera.isActive) {
      throw new Error('Camera is offline or does not exist');
    }

    // Verify User Access
    const accessibleCameras = await this.getAccessibleCameras(userId, role);
    if (!accessibleCameras.find((c) => c.id === cameraId)) {
      await _AuditService.auditService.log({
        action: 'UNAUTHORIZED_CAMERA_ACCESS',
        userId,
        resource: 'CAMERA',
        resourceId: cameraId,
        ipAddress
      });
      throw new Error('غير مصرح لك بمشاهدة هذه الكاميرا (Unauthorized to view this camera)');
    }

    // Check Schedule Constraints (Bypass for ADMIN)
    if (role !== 'ADMIN') {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sun
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Check if manually force locked
      if (camera.scheduleConfig?.forceLocked) {
        throw new Error('تم قفل البث مؤقتاً من قبل إدارة الحضانة');
      }

      const activeSchedule = (camera.schedules || []).find((s) => {
        if (!s.isActive || s.dayOfWeek !== currentDay) return false;
        const startParts = (s.startTime || '00:00').split(':').map(Number);
        const endParts = (s.endTime || '23:59').split(':').map(Number);
        const startMin = startParts[0] * 60 + (startParts[1] || 0);
        const endMin = endParts[0] * 60 + (endParts[1] || 0);
        return currentMinutes >= startMin && currentMinutes <= endMin;
      });

      if (!activeSchedule && !camera.scheduleConfig?.is24h) {
        throw new Error('البث المباشر لهذه الكاميرا مقفل حالياً وفق الجدول الزمني (outside of scheduled hours)');
      }
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const streamToken = _jsonwebtoken.default.sign(
      { sub: userId, cameraId, role },
      jwtSecret,
      { expiresIn: '5m' }
    );

    const tokenHash = _crypto.default.createHash('sha256').update(streamToken).digest('hex');

    // Store Session
    try {
      await _prisma.prisma.streamSession.create({
        data: {
          userId,
          cameraId,
          tokenHash,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        }
      });
    } catch (e) {
      // ignore
    }

    // Audit Log
    await _AuditService.auditService.log({
      action: 'CAMERA_ACCESS_GRANTED',
      userId,
      resource: 'CAMERA',
      resourceId: cameraId,
      ipAddress
    });

    const mediaServerUrl = process.env.MEDIA_SERVER_URL || 'https://stream.yourdomain.com';
    let streamKey = 'cam1';
    if (camera.streamUrl && /^cam[1-7]$/i.test(camera.streamUrl.trim())) {
      streamKey = camera.streamUrl.trim().toLowerCase();
    } else if (camera.name && camera.name.toLowerCase().match(/cam[1-7]/)) {
      streamKey = camera.name.toLowerCase().match(/cam[1-7]/)[0];
    } else if (camera.id && camera.id.match(/cam-(?:sleep|play)-?([1-7])/)) {
      streamKey = 'cam' + camera.id.match(/cam-(?:sleep|play)-?([1-7])/)[1];
    }

    const wsUrl = mediaServerUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');

    return {
      cameraId: camera.id,
      cameraName: camera.name,
      className: camera.class?.name || 'قاعة الأطفال',
      streamKey,
      token: streamToken,
      mediaServerUrl,
      webrtcOfferUrl: `${mediaServerUrl}/api/webrtc?src=${streamKey}&token=${streamToken}`,
      webrtcWsUrl: `${wsUrl}/api/ws?src=${streamKey}&token=${streamToken}`,
      hlsUrl: `${mediaServerUrl}/api/stream.m3u8?src=${streamKey}&token=${streamToken}`,
      webrtcUrl: `${mediaServerUrl}/${camera.name}/webrtc?token=${streamToken}`,
      streamUrl: `${mediaServerUrl}/${camera.name}/stream.m3u8?token=${streamToken}`,
      expiresIn: 300
    };
  }

  // Get Comprehensive Permissions Matrix for Admin View
  async getPermissionsMatrix() {
    const allCameras = await this.getAllCameras();
    let allUsers = [];
    let allChildren = [];

    try {
      allUsers = await _prisma.prisma.user.findMany({
        where: { role: { in: ['PARENT', 'TEACHER'] } },
        include: {
          children: { include: { class: true } },
          teacherClasses: { include: { class: true } }
        }
      });
      allChildren = await _prisma.prisma.child.findMany({
        include: { class: true }
      });
    } catch (e) {
      // Fallback
    }

    if (!allUsers || allUsers.length === 0) {
      allUsers = dbStore.get('users') || [];
      allChildren = dbStore.get('children') || [];
    }

    const allOverrides = dbStore.get('cameraPermissions') || {};

    const usersData = allUsers
      .filter((u) => u.role === 'PARENT' || u.role === 'TEACHER')
      .map((user) => {
        let userChildren = user.children || [];
        if (userChildren.length === 0 && allChildren.length > 0) {
          userChildren = allChildren.filter((c) => c.parentId === user.id);
        }

        const userClassIds = userChildren.map((c) => c.classId);
        if (user.teacherClasses) {
          user.teacherClasses.forEach((tc) => userClassIds.push(tc.classId));
        }
        if (user.assignedClass) userClassIds.push(user.assignedClass);

        const overrides = allOverrides[user.id] || {};

        const matrix = {};
        allCameras.forEach((cam) => {
          const isPlayroom = this.isPlayroomCamera(cam);
          const isChildClass = userClassIds.some((cid) => {
            if (!cid) return false;
            if (cid === cam.classId) return true;
            if (cid.includes('sleep-1') && cam.id.includes('sleep-1')) return true;
            if (cid.includes('sleep-2') && cam.id.includes('sleep-2')) return true;
            if (cid.includes('sleep-3') && cam.id.includes('sleep-3')) return true;
            if (cid.includes('sleep-4') && cam.id.includes('sleep-4')) return true;
            if (cid.includes('hope') && (cam.id.includes('sleep-1') || cam.id.includes('sleep-2'))) return true;
            if (cid.includes('birds') && cam.id.includes('sleep-3')) return true;
            if (cid.includes('flowers') && cam.id.includes('sleep-4')) return true;
            return false;
          });

          const defaultStatus = isPlayroom || isChildClass ? 'ALLOW' : 'DENY';
          const overrideStatus = overrides[cam.id] || 'DEFAULT';
          const effectiveStatus =
            overrideStatus === 'ALLOW' ? 'ALLOW' : overrideStatus === 'DENY' ? 'DENY' : defaultStatus;

          let reason = '';
          if (overrideStatus === 'ALLOW') {
            reason = 'سماح مخصص من الإدارة';
          } else if (overrideStatus === 'DENY') {
            reason = 'حظر مخصص من الإدارة';
          } else if (isPlayroom) {
            reason = 'مسموح افتراضياً: غرفة الألعاب المشتركة';
          } else if (isChildClass) {
            reason = 'مسموح افتراضياً: صف طفل ولي الأمر';
          } else {
            reason = 'ممنوع افتراضياً: صف آخر';
          }

          matrix[cam.id] = {
            effective: effectiveStatus === 'ALLOW',
            effectiveStatus,
            overrideStatus,
            defaultStatus,
            reason,
            isOverride: overrideStatus !== 'DEFAULT'
          };
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          children: userChildren.map((c) => ({
            id: c.id,
            name: c.name,
            classId: c.classId,
            className: c.class?.name || c.classId
          })),
          assignedClass: user.assignedClass || null,
          overrides,
          matrix
        };
      });

    return {
      cameras: allCameras.map((cam) => ({
        id: cam.id,
        name: cam.name,
        streamUrl: cam.streamUrl,
        className: cam.class?.name || 'قاعة عامة',
        classId: cam.classId,
        isActive: cam.isActive,
        isPlayroom: this.isPlayroomCamera(cam)
      })),
      users: usersData
    };
  }
}

exports.CameraService = CameraService;
const cameraService = (exports.cameraService = new CameraService());