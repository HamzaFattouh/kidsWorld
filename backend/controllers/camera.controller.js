"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.cameraController = exports.CameraController = void 0;
var _camera = require("../services/camera.service");

class CameraController {

  async getCameras(req, res) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const cameras = await _camera.cameraService.getAccessibleCameras(user.id, user.role);

      // Filter out internal stream urls and exact schedules to prevent scraping
      const safeCameras = cameras.map((c) => ({
        id: c.id,
        name: c.name,
        className: c.class.name,
        isActive: c.isActive
      }));

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