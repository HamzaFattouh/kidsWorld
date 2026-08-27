import { Router } from 'express';
import { createIncident, getIncidents, createWeeklyNote, getWeeklyNotes, createEvaluation, getEvaluations } from './reporting.controller';
import { createIncidentSchema, createWeeklyNoteSchema, createEvaluationSchema } from './reporting.dto';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/sessionValidator';
import { requireOwnership, requirePermission } from '../../middlewares/authorize';

const reportingRouter = Router();

reportingRouter.post('/incidents', requireAuth, requireOwnership('child', 'childId'), validateRequest(createIncidentSchema), createIncident);
reportingRouter.get('/incidents/:childId', requireAuth, requireOwnership('child', 'childId'), getIncidents);

reportingRouter.post('/notes', requireAuth, requireOwnership('child', 'childId'), validateRequest(createWeeklyNoteSchema), createWeeklyNote);
reportingRouter.get('/notes/:childId', requireAuth, requireOwnership('child', 'childId'), getWeeklyNotes);

reportingRouter.post('/evaluations', requireAuth, requireOwnership('child', 'childId'), validateRequest(createEvaluationSchema), createEvaluation);
reportingRouter.get('/evaluations/:childId', requireAuth, requireOwnership('child', 'childId'), getEvaluations);

export default reportingRouter;
