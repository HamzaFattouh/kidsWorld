import { Router } from 'express';
import { cameraController } from '../controllers/camera.controller';
import { requireAuth } from '../api/middlewares/sessionValidator';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Protect all camera routes with authentication
router.use(requireAuth);

// Rate limiter specifically for requesting camera stream tokens to prevent brute forcing or abuse
const accessLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP/user to 10 requests per minute
  message: { error: 'Too many stream requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
router.get('/', cameraController.getCameras.bind(cameraController));
router.post('/:id/access', accessLimiter, cameraController.getCameraAccess.bind(cameraController));

export { router as cameraRoutes };
