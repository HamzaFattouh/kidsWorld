"use strict";var _supertest = _interopRequireDefault(require("supertest"));
var _app = _interopRequireDefault(require("../backend/app"));
var _prisma = require("../backend/core/prisma");
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _crypto = _interopRequireDefault(require("crypto"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

// Setup Mock User
const mockUser = {
  id: 'test-user-id',
  email: 'test@nursery.com',
  passwordHash: '', // Set in beforeAll
  role: 'PARENT',
  isActive: true,
  isVerified: true,
  requiresPasswordChange: false
};

const setupUser = async () => {
  const hash = await _bcrypt.default.hash('password123', 10);
  await _prisma.prisma.user.create({ data: { ...mockUser, role: 'PARENT', passwordHash: hash } });
};

describe('Auth API (11 Scenarios)', () => {
  beforeAll(async () => {
    // Clear DB
    await _prisma.prisma.user.deleteMany();
    await setupUser();
  });

  afterAll(async () => {
    await _prisma.prisma.$disconnect();
  });

  afterEach(async () => {
    // Reset specific states
    await _prisma.prisma.user.update({
      where: { email: mockUser.email },
      data: { isActive: true, isVerified: true, requiresPasswordChange: false }
    });
    await _prisma.prisma.session.deleteMany();
    await _prisma.prisma.token.deleteMany();
  });

  it('1. Valid login', async () => {
    const res = await (0, _supertest.default)(_app.default).
    post('/api/v1/auth/login').
    send({ email: 'test@nursery.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    // Web Cookie check
    expect(res.headers['set-cookie'][0]).toMatch(/token=/);
  });

  it('2. Invalid password', async () => {
    const res = await (0, _supertest.default)(_app.default).
    post('/api/v1/auth/login').
    send({ email: 'test@nursery.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('3. Disabled account', async () => {
    await _prisma.prisma.user.update({ where: { email: mockUser.email }, data: { isActive: false } });
    const res = await (0, _supertest.default)(_app.default).
    post('/api/v1/auth/login').
    send({ email: 'test@nursery.com', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Account is disabled');
  });

  it('4. Email verification required', async () => {
    await _prisma.prisma.user.update({ where: { email: mockUser.email }, data: { isVerified: false } });
    const res = await (0, _supertest.default)(_app.default).
    post('/api/v1/auth/login').
    send({ email: 'test@nursery.com', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Email not verified');
  });

  it('5. Forced password change flag', async () => {
    await _prisma.prisma.user.update({ where: { email: mockUser.email }, data: { requiresPasswordChange: true } });
    const res = await (0, _supertest.default)(_app.default).
    post('/api/v1/auth/login').
    send({ email: 'test@nursery.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.data.user.requiresPasswordChange).toBe(true);
  });

  it('6. Email verification success', async () => {
    await _prisma.prisma.user.update({ where: { email: mockUser.email }, data: { isVerified: false } });

    const token = '12345';
    const hash = _crypto.default.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    await _prisma.prisma.token.create({ data: { userId: mockUser.id, type: 'VERIFICATION', tokenHash: hash, expiresAt } });

    const res = await (0, _supertest.default)(_app.default).post('/api/v1/auth/verify-email').send({ token });
    expect(res.status).toBe(200);

    const user = await _prisma.prisma.user.findUnique({ where: { id: mockUser.id } });
    expect(user?.isVerified).toBe(true);
  });

  it('7. Expired reset token', async () => {
    const token = '12345';
    const hash = _crypto.default.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() - 1); // Expired
    await _prisma.prisma.token.create({ data: { userId: mockUser.id, type: 'RESET', tokenHash: hash, expiresAt } });

    const res = await (0, _supertest.default)(_app.default).post('/api/v1/auth/reset-password').send({ token, newPassword: 'new' });
    expect(res.status).toBe(400); // Validation error
  });

  it('8. Reused/Invalid reset token', async () => {
    const res = await (0, _supertest.default)(_app.default).post('/api/v1/auth/reset-password').send({ token: 'fake', newPassword: 'new' });
    expect(res.status).toBe(400);
  });

  it('9. Logout revokes session', async () => {
    const loginRes = await (0, _supertest.default)(_app.default).post('/api/v1/auth/login').send({ email: 'test@nursery.com', password: 'password123' });
    const token = loginRes.body.data.token;

    // Logout
    const logoutRes = await (0, _supertest.default)(_app.default).post('/api/v1/auth/logout').set('Authorization', `Bearer ${token}`);
    expect(logoutRes.status).toBe(200);

    // Verify session deleted in DB
    const hash = _crypto.default.createHash('sha256').update(token).digest('hex');
    const session = await _prisma.prisma.session.findUnique({ where: { tokenHash: hash } });
    expect(session).toBeNull();
  });

  it('10. Session revocation validation in middleware', async () => {
    const loginRes = await (0, _supertest.default)(_app.default).post('/api/v1/auth/login').send({ email: 'test@nursery.com', password: 'password123' });
    const token = loginRes.body.data.token;

    // Manually delete session to simulate revocation
    await _prisma.prisma.session.deleteMany();

    // Need a protected route to test middleware - we can test the change-password route
    const res = await (0, _supertest.default)(_app.default).
    post('/api/v1/auth/change-password').
    set('Authorization', `Bearer ${token}`).
    send({ newPassword: 'new' });

    expect(res.status).toBe(401);
  });

  it('11. Rate limiting', async () => {
    for (let i = 0; i < 5; i++) {
      await (0, _supertest.default)(_app.default).post('/api/v1/auth/login').send({ email: 'test@nursery.com', password: 'wrong' });
    }
    const res = await (0, _supertest.default)(_app.default).post('/api/v1/auth/login').send({ email: 'test@nursery.com', password: 'wrong' });
    expect(res.status).toBe(429); // Too many requests
  });
});