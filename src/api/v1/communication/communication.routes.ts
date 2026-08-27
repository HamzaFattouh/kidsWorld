import { Router } from 'express';
import { createComplaint, getComplaints, createRequest, getRequests, sendMessage, getThread } from './communication.controller';
import { createComplaintSchema, createRequestSchema, sendMessageSchema } from './communication.dto';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/sessionValidator';

const commRouter = Router();

// Everyone relies on token identity for authorization here.

commRouter.post('/complaints', requireAuth, validateRequest(createComplaintSchema), createComplaint);
commRouter.get('/complaints', requireAuth, getComplaints);

commRouter.post('/requests', requireAuth, validateRequest(createRequestSchema), createRequest);
commRouter.get('/requests', requireAuth, getRequests);

commRouter.post('/messages', requireAuth, validateRequest(sendMessageSchema), sendMessage);
commRouter.get('/messages/:otherUserId', requireAuth, getThread);

export default commRouter;
