"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.cameraController = exports.CameraController = void 0;
var _camera = require("../services/camera.service");

class CameraController {

  async getCameras(req, res) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const cameras = await _camera.cameraService.getAccessibleCameras(user.id, user.role);

      const now = new Date();
      const currentDay = now.getDay();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Return safe camera metadata with active schedule status
      const safeCameras = cameras.map((c) => {
        const activeSchedule = (c.schedules || []).find((s) => {
          if (!s.isActive || s.dayOfWeek !== currentDay) return false;
          const startParts = (s.startTime || '00:00').split(':').map(Number);
          const endParts = (s.endTime || '23:59').split(':').map(Number);
          const startMin = startParts[0] * 60 + (startParts[1] || 0);
          const endMin = endParts[0] * 60 + (endParts[1] || 0);
          return currentMinutes >= startMin && currentMinutes <= endMin;
        });

        let streamKey = 'cam1';
        if (c.streamUrl && /^cam[1-7]$/i.test(c.streamUrl.trim())) {
          streamKey = c.streamUrl.trim().toLowerCase();
        } else if (c.id && c.id.match(/cam-([1-7])/)) {
          streamKey = 'cam' + c.id.match(/cam-([1-7])/)[1];
        }

        return {
          id: c.id,
          name: c.name,
          className: c.class ? c.class.name : 'قاعة عامة',
          classId: c.classId,
          isActive: c.isActive,
          streamKey,
          isWithinSchedule: user.role === 'ADMIN' ? true : Boolean(activeSchedule),
          schedules: (c.schedules || []).map((s) => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            isActive: s.isActive
          }))
        };
      });

      return res.json({ data: safeCameras });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getCameraAccess(req, res) {
    try {
      const user = req.user;
      const cameraId = req.params.id;
      const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const accessData = await _camera.cameraService.requestCameraAccess(user.id, user.role, cameraId, ipAddress);

      return res.json({ data: accessData });
    } catch (error) {
      if (error.message.includes('Unauthorized') || error.message.includes('outside of scheduled hours')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes('offline')) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}exports.CameraController = CameraController;

const cameraController = exports.cameraController = new CameraController();