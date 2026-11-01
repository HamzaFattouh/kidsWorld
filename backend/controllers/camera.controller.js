"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cameraController = exports.CameraController = void 0;

var _camera = require("../services/camera.service");

class CameraController {
  // GET /api/v1/cameras
  async getCameras(req, res) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const cameras = await _camera.cameraService.getAccessibleCameras(user.id, user.role);

      const now = new Date();
      const currentDay = now.getDay();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Return camera metadata with active schedule status
      const safeCameras = cameras.map((c) => {
        const isForceLocked = c.scheduleConfig?.forceLocked || false;
        const is24h = c.scheduleConfig?.is24h || false;

        const activeSchedule = (c.schedules || []).find((s) => {
          if (!s.isActive || s.dayOfWeek !== currentDay) return false;
          const startParts = (s.startTime || '00:00').split(':').map(Number);
          const endParts = (s.endTime || '23:59').split(':').map(Number);
          const startMin = startParts[0] * 60 + (startParts[1] || 0);
          const endMin = endParts[0] * 60 + (endParts[1] || 0);
          return currentMinutes >= startMin && currentMinutes <= endMin;
        });

        const isWithinSchedule = user.role === 'ADMIN'
          ? true
          : !isForceLocked && (is24h || Boolean(activeSchedule));

        let streamKey = 'cam1';
        if (c.streamUrl && /^cam[1-7]$/i.test(c.streamUrl.trim())) {
          streamKey = c.streamUrl.trim().toLowerCase();
        } else if (c.id && c.id.match(/cam-(?:sleep|play)-?([1-7])/)) {
          streamKey = 'cam' + c.id.match(/cam-(?:sleep|play)-?([1-7])/)[1];
        }

        const scheduleInfo = c.schedules?.[0] || {
          startTime: '07:30',
          endTime: '14:30'
        };

        return {
          id: c.id,
          name: c.name,
          className: c.class ? c.class.name : 'قاعة عامة',
          classId: c.classId,
          isActive: c.isActive,
          streamUrl: c.streamUrl,
          streamKey,
          orderIndex: c.orderIndex || 0,
          isWithinSchedule,
          isForceLocked,
          is24h,
          schedule: {
            startTime: c.scheduleConfig?.startTime || scheduleInfo.startTime || '07:30',
            endTime: c.scheduleConfig?.endTime || scheduleInfo.endTime || '14:30',
            daysOfWeek: c.scheduleConfig?.daysOfWeek || [0, 1, 2, 3, 4],
            is24h,
            forceLocked: isForceLocked
          },
          schedules: c.schedules || []
        };
      });

      return res.json({ data: safeCameras });
    } catch (error) {
      console.error('getCameras error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // PUT /api/v1/cameras/:id
  async updateCamera(req, res) {
    try {
      const user = req.user;
      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'صلاحيات الآدمن مطلوبة لتعديل إعدادات الكاميرا' });
      }

      const cameraId = req.params.id;
      const updateData = req.body;

      const updated = await _camera.cameraService.updateCamera(cameraId, updateData);
      return res.json({ success: true, data: updated });
    } catch (error) {
      console.error('updateCamera error:', error);
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  // POST /api/v1/cameras/:id/access
  async getCameraAccess(req, res) {
    try {
      const user = req.user;
      const cameraId = req.params.id;
      const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const accessData = await _camera.cameraService.requestCameraAccess(user.id, user.role, cameraId, ipAddress);
      return res.json({ data: accessData });
    } catch (error) {
      if (error.message.includes('Unauthorized') || error.message.includes('غير مصرح') || error.message.includes('مقفل')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes('offline')) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  // GET /api/v1/cameras/permissions
  async getPermissionsMatrix(req, res) {
    try {
      const user = req.user;
      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'صلاحيات الآدمن مطلوبة لإدارة أذونات الكاميرات' });
      }

      const data = await _camera.cameraService.getPermissionsMatrix();
      return res.json({ data });
    } catch (error) {
      console.error('getPermissionsMatrix error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // PUT /api/v1/cameras/permissions/:userId
  async updateUserPermissions(req, res) {
    try {
      const user = req.user;
      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'صلاحيات الآدمن مطلوبة' });
      }

      const targetUserId = req.params.userId;
      const { overrides } = req.body;

      if (!overrides || typeof overrides !== 'object') {
        return res.status(400).json({ error: 'قائمة الصلاحيات غير صالحة' });
      }

      const updatedOverrides = _camera.cameraService.setUserOverrides(targetUserId, overrides);
      return res.json({ success: true, data: updatedOverrides });
    } catch (error) {
      console.error('updateUserPermissions error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // POST /api/v1/cameras/permissions/reset/:userId
  async resetUserPermissions(req, res) {
    try {
      const user = req.user;
      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'صلاحيات الآدمن مطلوبة' });
      }

      const targetUserId = req.params.userId;
      const result = _camera.cameraService.resetUserOverrides(targetUserId);
      return res.json({ success: true, data: result });
    } catch (error) {
      console.error('resetUserPermissions error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

exports.CameraController = CameraController;
const cameraController = (exports.cameraController = new CameraController());