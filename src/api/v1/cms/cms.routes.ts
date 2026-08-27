import { Router } from 'express';
import { createAnnouncement, getAnnouncements, createPost, getPosts, uploadGallery } from './cms.controller';
import { createAnnouncementSchema, createPostSchema } from './cms.dto';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/sessionValidator';
import { requirePermission } from '../../middlewares/authorize';
import { upload } from '../../middlewares/upload';

const cmsRouter = Router();

// Public Routes (Optional Auth)
cmsRouter.get('/announcements', getAnnouncements);
cmsRouter.get('/posts', getPosts);

// Protected Admin Routes
cmsRouter.post('/announcements', requireAuth, requirePermission('MANAGE_USERS'), validateRequest(createAnnouncementSchema), createAnnouncement);
cmsRouter.post('/posts', requireAuth, requirePermission('MANAGE_USERS'), validateRequest(createPostSchema), createPost);
cmsRouter.post('/gallery', requireAuth, requirePermission('MANAGE_USERS'), upload.single('image'), uploadGallery);

export default cmsRouter;
