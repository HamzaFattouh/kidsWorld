import { Router } from 'express';
import { registerDevice, removeDevice, updatePreferences, getPreferences, getInbox, markAsRead } from './notifications.controller';
import { registerDeviceSchema, updatePreferenceSchema } from './notifications.dto';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/sessionValidator';

const notifRouter = Router();

notifRouter.use(requireAuth);

notifRouter.post('/device', validateRequest(registerDeviceSchema), registerDevice);
notifRouter.delete('/device/:token', removeDevice);

notifRouter.get('/preferences', getPreferences);
notifRouter.patch('/preferences', validateRequest(updatePreferenceSchema), updatePreferences);

notifRouter.get('/inbox', getInbox);
notifRouter.patch('/inbox/:id/read', markAsRead);

export default notifRouter;
