import { Router } from 'express';
import { createChild, listChildren, getChild, createClass, listClasses } from './core.controller';
import { createChildSchema, createClassSchema, querySchema } from './core.dto';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/sessionValidator';
import { requirePermission, requireOwnership } from '../../middlewares/authorize';

const coreRouter = Router();

// Classes (Admin manages, everyone can list)
coreRouter.post('/classes', requireAuth, requirePermission('manage:classes'), validateRequest(createClassSchema), createClass);
coreRouter.get('/classes', requireAuth, validateRequest(querySchema), listClasses);

// Children
coreRouter.post('/children', requireAuth, requirePermission('manage:children'), validateRequest(createChildSchema), createChild);
coreRouter.get('/children', requireAuth, validateRequest(querySchema), listChildren);
coreRouter.get('/children/:id', requireAuth, requireOwnership('child'), getChild);

export default coreRouter;
