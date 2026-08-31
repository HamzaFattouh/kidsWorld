import { Router } from 'express';
import { uploadImage } from '../controllers/cms.controller';

const router = Router();

// Endpoint for uploading CMS images
// We should ideally protect this with an auth middleware that checks for ADMIN role.
// For now, it will be publicly accessible in development, or we can add basic protection if available.
router.post('/upload-image', uploadImage);

export { router as cmsRoutes };
