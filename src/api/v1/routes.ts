import { Router } from 'express';
import { getHealthStatus } from './health/health.controller';
import authRouter from './auth/auth.routes';
import coreRouter from './core/core.routes';
import opsRouter from './operations/operations.routes';
import reportingRouter from './reporting/reporting.routes';
import commRouter from './communication/communication.routes';
import notifRouter from './notifications/notifications.routes';
import cmsRouter from './cms/cms.routes';
import usersRouter from './users/users.routes';
import autoRouter from './auto/auto.routes';

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/core', coreRouter);
v1Router.use('/operations', opsRouter);
v1Router.use('/reporting', reportingRouter);
v1Router.use('/communication', commRouter);
v1Router.use('/notifications', notifRouter);
v1Router.use('/cms', cmsRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/auto', autoRouter);

v1Router.get('/health', getHealthStatus);

export default v1Router;
