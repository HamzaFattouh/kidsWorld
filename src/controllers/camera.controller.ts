import { Request, Response } from 'express';
import { cameraService } from '../services/camera.service';

export class CameraController {
  
  async getCameras(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const cameras = await cameraService.getAccessibleCameras(user.id, user.role as any);
      
      // Filter out internal stream urls and exact schedules to prevent scraping
      const safeCameras = cameras.map((c: any) => ({
        id: c.id,
        name: c.name,
        className: c.class.name,
        isActive: c.isActive
      }));

      return res.json({ data: safeCameras });
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getCameraAccess(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const cameraId = req.params.id;
      const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const accessData = await cameraService.requestCameraAccess(user.id, user.role as any, cameraId as string, ipAddress as string);
      
      return res.json({ data: accessData });
    } catch (error: any) {
      if (error.message.includes('Unauthorized') || error.message.includes('outside of scheduled hours')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes('offline')) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export const cameraController = new CameraController();
