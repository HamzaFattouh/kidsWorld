import { Router } from 'express';
import { listResource, createResource } from './auto.controller';
import { requireAuth } from '../../middlewares/sessionValidator';

const autoRouter = Router();

// Generic auto routes for rapid prototyping of all modules
autoRouter.get('/:resource', requireAuth, listResource);
autoRouter.post('/:resource', requireAuth, createResource);

export default autoRouter;
