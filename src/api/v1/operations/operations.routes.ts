import { Router } from 'express';
import { logAttendance, getAttendance, logMeal, getMeals, logActivity, getActivities } from './operations.controller';
import { logAttendanceSchema, getAttendanceSchema, logMealSchema, logActivitySchema } from './operations.dto';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/sessionValidator';
import { requireOwnership, requirePermission } from '../../middlewares/authorize';

const opsRouter = Router();

// Middleware: Teachers log data (body childId is validated), Parents/Teachers view data (param childId is validated)
// We rely on requireOwnership which checks params, body, or query for ID.

opsRouter.post('/attendance', requireAuth, requireOwnership('child', 'childId'), validateRequest(logAttendanceSchema), logAttendance);
opsRouter.get('/attendance/:childId', requireAuth, requireOwnership('child', 'childId'), validateRequest(getAttendanceSchema), getAttendance);

opsRouter.post('/meals', requireAuth, requireOwnership('child', 'childId'), validateRequest(logMealSchema), logMeal);
opsRouter.get('/meals/:childId', requireAuth, requireOwnership('child', 'childId'), getMeals);

opsRouter.post('/activities', requireAuth, requireOwnership('child', 'childId'), validateRequest(logActivitySchema), logActivity);
opsRouter.get('/activities/:childId', requireAuth, requireOwnership('child', 'childId'), getActivities);

export default opsRouter;
