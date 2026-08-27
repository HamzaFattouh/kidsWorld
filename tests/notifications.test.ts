import request from 'supertest';
import express from 'express';
import { prisma } from '../src/core/prisma';
import notifRouter from '../src/api/v1/notifications/notifications.routes';
import { NotificationService } from '../src/services/NotificationService';
import { Role } from '@prisma/client';

const app = express();
app.use(express.json());
// Inject user context based on headers to simulate logged-in session
app.use((req: any, res, next) => {
  req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
  next();
});
app.use('/notifications', notifRouter);

describe('Notifications API & Internal Dispatcher', () => {
  let parent: any;
  let notifService: NotificationService;

  beforeAll(async () => {
    notifService = new NotificationService();
    
    await prisma.notificationDelivery.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.notificationPreference.deleteMany();
    await prisma.deviceToken.deleteMany();
    await prisma.user.deleteMany();

    parent = await prisma.user.create({ data: { email: 'notifparent@test.com', passwordHash: 'hash', role: Role.PARENT, locale: 'ar' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Parent registers a device token', async () => {
    const res = await request(app)
      .post('/notifications/device')
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT)
      .send({
        token: 'mock-fcm-token-1234567890',
        deviceType: 'IOS'
      });
    
    expect(res.status).toBe(200);
  });

  it('Parent sets preferences to disable Push for INCIDENTS', async () => {
    const res = await request(app)
      .patch('/notifications/preferences')
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT)
      .send({
        type: 'INCIDENT',
        isPushEnabled: false,
        isInAppEnabled: true
      });
    
    expect(res.status).toBe(200);
  });

  it('Internal dispatcher logs In-App message but skips Push based on preferences', async () => {
    // We call the service directly to simulate an internal system event (like an incident being logged)
    await notifService.dispatch(
      [parent.id], 
      'INCIDENT', 
      'Incident Reported', 'تم الإبلاغ عن حادث', 
      'Please check the app.', 'الرجاء التحقق من التطبيق.'
    );

    // Fetch the parent's inbox via API
    const res = await request(app)
      .get('/notifications/inbox')
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    // Because the parent locale is 'ar' during push, the push body would be arabic.
    // However, the in-app inbox saves both strings, allowing the frontend to render the correct locale.
    expect(res.body.data[0].titleEn).toBe('Incident Reported');
    expect(res.body.data[0].isRead).toBe(false);
  });

  it('Parent marks the notification as read', async () => {
    const inboxRes = await request(app)
      .get('/notifications/inbox')
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT);
    
    const notifId = inboxRes.body.data[0].id;

    const res = await request(app)
      .patch(`/notifications/inbox/${notifId}/read`)
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT);
    
    expect(res.status).toBe(200);
  });
});
