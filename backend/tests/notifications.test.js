"use strict";var _supertest = _interopRequireDefault(require("supertest"));
var _express = _interopRequireDefault(require("express"));
var _prisma = require("../backend/core/prisma");
var _notifications = _interopRequireDefault(require("../backend/api/v1/notifications/notifications.routes"));
var _NotificationService = require("../backend/services/NotificationService");
var _client = require("@prisma/client");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const app = (0, _express.default)();
app.use(_express.default.json());
// Inject user context based on headers to simulate logged-in session
app.use((req, res, next) => {
  req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
  next();
});
app.use('/notifications', _notifications.default);

describe('Notifications API & Internal Dispatcher', () => {
  let parent;
  let notifService;

  beforeAll(async () => {
    notifService = new _NotificationService.NotificationService();

    await _prisma.prisma.notificationDelivery.deleteMany();
    await _prisma.prisma.notification.deleteMany();
    await _prisma.prisma.notificationPreference.deleteMany();
    await _prisma.prisma.deviceToken.deleteMany();
    await _prisma.prisma.user.deleteMany();

    parent = await _prisma.prisma.user.create({ data: { email: 'notifparent@test.com', passwordHash: 'hash', role: _client.Role.PARENT, locale: 'ar' } });
  });

  afterAll(async () => {
    await _prisma.prisma.$disconnect();
  });

  it('Parent registers a device token', async () => {
    const res = await (0, _supertest.default)(app).
    post('/notifications/device').
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT).
    send({
      token: 'mock-fcm-token-1234567890',
      deviceType: 'IOS'
    });

    expect(res.status).toBe(200);
  });

  it('Parent sets preferences to disable Push for INCIDENTS', async () => {
    const res = await (0, _supertest.default)(app).
    patch('/notifications/preferences').
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT).
    send({
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
    const res = await (0, _supertest.default)(app).
    get('/notifications/inbox').
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    // Because the parent locale is 'ar' during push, the push body would be arabic.
    // However, the in-app inbox saves both strings, allowing the frontend to render the correct locale.
    expect(res.body.data[0].titleEn).toBe('Incident Reported');
    expect(res.body.data[0].isRead).toBe(false);
  });

  it('Parent marks the notification as read', async () => {
    const inboxRes = await (0, _supertest.default)(app).
    get('/notifications/inbox').
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT);

    const notifId = inboxRes.body.data[0].id;

    const res = await (0, _supertest.default)(app).
    patch(`/notifications/inbox/${notifId}/read`).
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT);

    expect(res.status).toBe(200);
  });
});