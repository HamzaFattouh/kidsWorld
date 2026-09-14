"use strict";









var _supertest = _interopRequireDefault(require("supertest"));
var _app = _interopRequireDefault(require("../backend/app"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}jest.mock('@prisma/client', () => ({ PrismaClient: class {camera = { findMany: jest.fn(), findUnique: jest.fn() };user = { findMany: jest.fn(), findUnique: jest.fn() };teacherClass = { findMany: jest.fn() };child = { findMany: jest.fn() };auditLog = { create: jest.fn() };} }));

describe('Security Measures', () => {
  describe('CSRF Protection', () => {
    it('should allow GET requests without CSRF header', async () => {
      const res = await (0, _supertest.default)(_app.default).get('/api/v1/auth/login'); // Or any GET
      // We just care that it doesn't throw the CSRF Forbidden error
      expect(res.status).not.toBe(403);
      if (res.body.error) {
        expect(JSON.stringify(res.body.error)).not.toMatch(/CSRF protection header/);
      }
    });

    it('should reject POST requests without CSRF header', async () => {
      const res = await (0, _supertest.default)(_app.default).post('/api/v1/auth/login').send({ email: 'test@example.com', password: '123' });
      expect(res.status).toBe(403);
      expect(JSON.stringify(res.body.error)).toMatch(/Missing CSRF protection header/);
    });

    it('should allow POST requests with CSRF header', async () => {
      const res = await (0, _supertest.default)(_app.default).
      post('/api/v1/auth/login').
      set('x-app-client', 'Web').
      send({ email: 'test@example.com', password: '123' });
      // Might be 400 for bad password validation, but not 403 CSRF
      expect(res.status).not.toBe(403);
    });
  });

  describe('Password Complexity', () => {
    it('should reject weak passwords on reset', async () => {
      const res = await (0, _supertest.default)(_app.default).
      post('/api/v1/auth/reset-password').
      set('x-app-client', 'Web').
      send({ token: 'abc', newPassword: '123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should allow strong passwords on reset', async () => {
      const res = await (0, _supertest.default)(_app.default).
      post('/api/v1/auth/reset-password').
      set('x-app-client', 'Web').
      send({ token: 'invalid_token_but_valid_format', newPassword: 'StrongPassword123!' });
      // Might be 400 because of invalid token, but not due to Zod schema validation
      // Let's check that the error is not a validation error array
      if (res.status === 400) {
        expect(Array.isArray(res.body.errors)).toBe(false);
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should block after 5 failed login attempts', async () => {
      // 5 allowed requests
      for (let i = 0; i < 5; i++) {
        await (0, _supertest.default)(_app.default).
        post('/api/v1/auth/login').
        set('x-app-client', 'Web').
        send({ email: 'fake@example.com', password: 'ValidPass123!' });
      }

      // 6th request should be blocked by rate limiter
      const res = await (0, _supertest.default)(_app.default).
      post('/api/v1/auth/login').
      set('x-app-client', 'Web').
      send({ email: 'fake@example.com', password: 'ValidPass123!' });

      expect(res.status).toBe(429);
      expect(res.text).toMatch(/Too many authentication attempts/);
    });
  });
});