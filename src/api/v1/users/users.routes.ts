import { Router } from 'express';
import { createUser, listUsers, setupProfile } from './users.controller';
import { createUserSchema, queryUsersSchema } from './users.dto';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/sessionValidator';
import { requirePermission } from '../../middlewares/authorize';

const usersRouter = Router();

usersRouter.post('/', requireAuth, requirePermission('manage:users'), validateRequest(createUserSchema), createUser);
usersRouter.get('/', requireAuth, requirePermission('manage:users'), validateRequest(queryUsersSchema), listUsers);
usersRouter.put('/setup-profile', requireAuth, setupProfile);

export default usersRouter;
