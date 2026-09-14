"use strict";var _supertest = _interopRequireDefault(require("supertest"));
var _express = _interopRequireDefault(require("express"));
var _prisma = require("../backend/core/prisma");
var _core = _interopRequireDefault(require("../backend/api/v1/core/core.routes"));
var _client = require("@prisma/client");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

// Minimal mock setup to bypass session generation for quick integration testing
const app = (0, _express.default)();
app.use(_express.default.json());
// Inject user context based on headers to simulate logged-in session
app.use((req, res, next) => {
  req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
  next();
});
app.use('/core', _core.default);

// We mock requirePermission and requireOwnership in authorize.ts for testing via jest.mock or similar
// But here we rely on the actual authz middleware logic which requires DB relationships!

describe('Core Entities API', () => {
  let admin, parent, teacher, class1, child;

  beforeAll(async () => {
    await _prisma.prisma.child.deleteMany();
    await _prisma.prisma.class.deleteMany();
    await _prisma.prisma.user.deleteMany();
    await _prisma.prisma.rolePermission.deleteMany();
    await _prisma.prisma.permission.deleteMany();

    // Setup Admin
    admin = await _prisma.prisma.user.create({ data: { email: 'coreadmin@test.com', passwordHash: 'hash', role: _client.Role.ADMIN } });

    // Setup Permission for manage:classes and manage:children
    const p1 = await _prisma.prisma.permission.create({ data: { action: 'manage:classes' } });
    const p2 = await _prisma.prisma.permission.create({ data: { action: 'manage:children' } });
    await _prisma.prisma.rolePermission.create({ data: { role: _client.Role.ADMIN, permissionId: p1.id } });
    await _prisma.prisma.rolePermission.create({ data: { role: _client.Role.ADMIN, permissionId: p2.id } });
  });

  afterAll(async () => {
    await _prisma.prisma.$disconnect();
  });

  it('Admin can create a Class', async () => {
    const res = await (0, _supertest.default)(app).
    post('/core/classes').
    set('x-user-id', admin.id).
    set('x-role', _client.Role.ADMIN).
    send({ name: 'Lions', capacity: 15, ageGroup: '3-4' });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Lions');
    class1 = res.body.data;
  });

  it('Admin can create a Parent and Child', async () => {
    parent = await _prisma.prisma.user.create({ data: { email: 'coreparent@test.com', passwordHash: 'hash', role: _client.Role.PARENT } });

    const res = await (0, _supertest.default)(app).
    post('/core/children').
    set('x-user-id', admin.id).
    set('x-role', _client.Role.ADMIN).
    send({ name: 'Leo', parentId: parent.id, classId: class1.id });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Leo');
    child = res.body.data;
  });

  it('Parent can list only their children', async () => {
    const res = await (0, _supertest.default)(app).
    get('/core/children').
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toBe(child.id);
  });

  it('Parent gets 403 when creating a class', async () => {
    const res = await (0, _supertest.default)(app).
    post('/core/classes').
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT).
    send({ name: 'Tigers' });

    expect(res.status).toBe(403);
  });
});