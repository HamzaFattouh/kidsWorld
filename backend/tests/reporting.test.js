"use strict";var _supertest = _interopRequireDefault(require("supertest"));
var _express = _interopRequireDefault(require("express"));
var _prisma = require("../backend/core/prisma");
var _reporting = _interopRequireDefault(require("../backend/api/v1/reporting/reporting.routes"));
var _client = require("@prisma/client");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const app = (0, _express.default)();
app.use(_express.default.json());
// Inject user context based on headers to simulate logged-in session
app.use((req, res, next) => {
  req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
  next();
});
app.use('/reporting', _reporting.default);

describe('Reporting API', () => {
  let parent, admin, teacher, class1, child;

  beforeAll(async () => {
    await _prisma.prisma.evaluation.deleteMany();
    await _prisma.prisma.weeklyNote.deleteMany();
    await _prisma.prisma.incident.deleteMany();
    await _prisma.prisma.child.deleteMany();
    await _prisma.prisma.class.deleteMany();
    await _prisma.prisma.user.deleteMany();

    parent = await _prisma.prisma.user.create({ data: { email: 'repparent@test.com', passwordHash: 'hash', role: _client.Role.PARENT } });
    teacher = await _prisma.prisma.user.create({ data: { email: 'repteacher@test.com', passwordHash: 'hash', role: _client.Role.TEACHER } });
    admin = await _prisma.prisma.user.create({ data: { email: 'repadmin@test.com', passwordHash: 'hash', role: _client.Role.ADMIN } });

    class1 = await _prisma.prisma.class.create({ data: { name: 'Reporting Class' } });
    await _prisma.prisma.teacherClass.create({ data: { teacherId: teacher.id, classId: class1.id } });

    child = await _prisma.prisma.child.create({ data: { name: 'Rep Child', parentId: parent.id, classId: class1.id } });
  });

  afterAll(async () => {
    await _prisma.prisma.$disconnect();
  });

  it('Teacher logs a PRIVATE incident', async () => {
    const res = await (0, _supertest.default)(app).
    post('/reporting/incidents').
    set('x-user-id', teacher.id).
    set('x-role', _client.Role.TEACHER).
    send({
      childId: child.id,
      date: new Date().toISOString(),
      time: '14:30',
      severity: 'MEDIUM',
      description: 'Pushed another kid.',
      isVisibleToParent: false
    });

    expect(res.status).toBe(201);
  });

  it('Parent requests incidents and does NOT see the private incident', async () => {
    const res = await (0, _supertest.default)(app).
    get(`/reporting/incidents/${child.id}`).
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it('Admin requests incidents and DOES see the private incident', async () => {
    const res = await (0, _supertest.default)(app).
    get(`/reporting/incidents/${child.id}`).
    set('x-user-id', admin.id).
    set('x-role', _client.Role.ADMIN);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it('Teacher logs a VISIBLE incident', async () => {
    await (0, _supertest.default)(app).
    post('/reporting/incidents').
    set('x-user-id', teacher.id).
    set('x-role', _client.Role.TEACHER).
    send({
      childId: child.id,
      date: new Date().toISOString(),
      time: '15:00',
      severity: 'LOW',
      description: 'Scraped knee on playground.',
      isVisibleToParent: true
    });
  });

  it('Parent requests incidents and DOES see the visible incident', async () => {
    const res = await (0, _supertest.default)(app).
    get(`/reporting/incidents/${child.id}`).
    set('x-user-id', parent.id).
    set('x-role', _client.Role.PARENT);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].severity).toBe('LOW');
  });

  it('Teacher logs an Evaluation', async () => {
    const res = await (0, _supertest.default)(app).
    post('/reporting/evaluations').
    set('x-user-id', teacher.id).
    set('x-role', _client.Role.TEACHER).
    send({
      childId: child.id,
      term: 'Fall 2026',
      learning: 4,
      communication: 5,
      socialSkills: 3,
      participation: 4,
      behavior: 3,
      creativity: 5,
      motorSkills: 4
    });

    expect(res.status).toBe(201);
    expect(res.body.data.term).toBe('Fall 2026');
  });
});