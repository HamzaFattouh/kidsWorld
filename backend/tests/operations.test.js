"use strict";var _supertest = _interopRequireDefault(require("supertest"));
var _express = _interopRequireDefault(require("express"));
var _prisma = require("../backend/core/prisma");
var _operations = _interopRequireDefault(require("../backend/api/v1/operations/operations.routes"));
var _client = require("@prisma/client");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const app = (0, _express.default)();
app.use(_express.default.json());
// Inject user context based on headers to simulate logged-in session
app.use((req, res, next) => {
  req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
  next();
});
app.use('/operations', _operations.default);

describe('Operations API', () => {
  let parent, teacher1, teacher2, class1, child;

  beforeAll(async () => {
    await _prisma.prisma.mealRecord.deleteMany();
    await _prisma.prisma.attendanceRecord.deleteMany();
    await _prisma.prisma.child.deleteMany();
    await _prisma.prisma.class.deleteMany();
    await _prisma.prisma.user.deleteMany();

    parent = await _prisma.prisma.user.create({ data: { email: 'opsparent@test.com', passwordHash: 'hash', role: _client.Role.PARENT } });
    teacher1 = await _prisma.prisma.user.create({ data: { email: 'opsteacher1@test.com', passwordHash: 'hash', role: _client.Role.TEACHER } });
    teacher2 = await _prisma.prisma.user.create({ data: { email: 'opsteacher2@test.com', passwordHash: 'hash', role: _client.Role.TEACHER } });

    class1 = await _prisma.prisma.class.create({ data: { name: 'Ops Class' } });
    await _prisma.prisma.teacherClass.create({ data: { teacherId: teacher1.id, classId: class1.id } });

    child = await _prisma.prisma.child.create({ data: { name: 'Ops Child', parentId: parent.id, classId: class1.id } });
  });

  afterAll(async () => {
    await _prisma.prisma.$disconnect();
  });

  it('Teacher 1 logs attendance for assigned child', async () => {
    const res = await (0, _supertest.default)(app).
    post('/operations/attendance').
    set('x-user-id', teacher1.id).
    set('x-role', _client.Role.TEACHER).
    send({ childId: child.id, date: new Date().toISOString(), status: 'PRESENT' });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('PRESENT');
  });

  it('Teacher 2 fails to log attendance for unassigned child', async () => {
    const res = await (0, _supertest.default)(app).
    post('/operations/attendance').
    set('x-user-id', teacher2.id).
    set('x-role', _client.Role.TEACHER).
    send({ childId: child.id, date: new Date().toISOString(), status: 'PRESENT' });

    expect(res.status).toBe(403);
  });

  it('Teacher 1 updates (upsert) attendance for same child on same day', async () => {
    const today = new Date().toISOString();
    // First record was logged in the first test
    const res = await (0, _supertest.default)(app).
    post('/operations/attendance').
    set('x-user-id', teacher1.id).
    set('x-role', _client.Role.TEACHER).
    send({ childId: child.id, date: today, status: 'EXCUSED' }); // Changed status

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('EXCUSED');
  });

  it('Parent views meals for their child', async () => {
    // Log a meal first
    await (0, _supertest.default)(app).
    post('/operations/meals').
    set('x-user-id', teacher1.id).
    set('x-role', _client.Role.TEACHER).
    send({ childId: child.id, date: new Date().toISOString(), type: 'LUNCH', consumed: 'ALL' });

    // Parent fetches
    const res = await (0, _supertest.default)(app).
    get(`/operations/meals/${child.id}`).
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].type).toBe('LUNCH');
  });
});