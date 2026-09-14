"use strict";var _supertest = _interopRequireDefault(require("supertest"));
var _express = _interopRequireDefault(require("express"));
var _prisma = require("../backend/core/prisma");
var _communication = _interopRequireDefault(require("../backend/api/v1/communication/communication.routes"));
var _client = require("@prisma/client");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const app = (0, _express.default)();
app.use(_express.default.json());
// Inject user context based on headers to simulate logged-in session
app.use((req, res, next) => {
  req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
  next();
});
app.use('/communication', _communication.default);

describe('Communication API', () => {
  let parent, teacher, admin, otherTeacher, class1, child;

  beforeAll(async () => {
    await _prisma.prisma.message.deleteMany();
    await _prisma.prisma.parentRequest.deleteMany();
    await _prisma.prisma.complaint.deleteMany();
    await _prisma.prisma.child.deleteMany();
    await _prisma.prisma.class.deleteMany();
    await _prisma.prisma.user.deleteMany();

    parent = await _prisma.prisma.user.create({ data: { email: 'commparent@test.com', passwordHash: 'hash', role: _client.Role.PARENT } });
    teacher = await _prisma.prisma.user.create({ data: { email: 'commteacher@test.com', passwordHash: 'hash', role: _client.Role.TEACHER } });
    otherTeacher = await _prisma.prisma.user.create({ data: { email: 'otherteacher@test.com', passwordHash: 'hash', role: _client.Role.TEACHER } });
    admin = await _prisma.prisma.user.create({ data: { email: 'commadmin@test.com', passwordHash: 'hash', role: _client.Role.ADMIN } });

    class1 = await _prisma.prisma.class.create({ data: { name: 'Comm Class' } });
    await _prisma.prisma.teacherClass.create({ data: { teacherId: teacher.id, classId: class1.id } });

    child = await _prisma.prisma.child.create({ data: { name: 'Comm Child', parentId: parent.id, classId: class1.id } });
  });

  afterAll(async () => {
    await _prisma.prisma.$disconnect();
  });

  it('Parent submits a LEAVE request', async () => {
    const res = await (0, _supertest.default)(app).
    post('/communication/requests').
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT).
    send({
      childId: child.id,
      type: 'LEAVE',
      description: 'Going on vacation next week.'
    });

    expect(res.status).toBe(201);
    expect(res.body.data.type).toBe('LEAVE');
  });

  it('Parent successfully sends a message to assigned Teacher', async () => {
    const res = await (0, _supertest.default)(app).
    post('/communication/messages').
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT).
    send({
      receiverId: teacher.id,
      content: 'Hello, how is my child doing?'
    });

    expect(res.status).toBe(201);
  });

  it('Parent gets 403 Forbidden when trying to message unassigned Teacher', async () => {
    const res = await (0, _supertest.default)(app).
    post('/communication/messages').
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT).
    send({
      receiverId: otherTeacher.id,
      content: 'Hello, are you my childs new teacher?'
    });

    expect(res.status).toBe(403);
  });

  it('Admin retrieves all complaints (even if none exist yet, checking endpoint)', async () => {
    const res = await (0, _supertest.default)(app).
    get('/communication/complaints').
    set('x-user-id', admin.id).
    set('x-role', _client.Role.ADMIN);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});