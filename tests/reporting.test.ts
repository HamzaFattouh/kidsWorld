import request from 'supertest';
import express from 'express';
import { prisma } from '../src/core/prisma';
import reportingRouter from '../src/api/v1/reporting/reporting.routes';
import { Role } from '@prisma/client';

const app = express();
app.use(express.json());
// Inject user context based on headers to simulate logged-in session
app.use((req: any, res, next) => {
  req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
  next();
});
app.use('/reporting', reportingRouter);

describe('Reporting API', () => {
  let parent: any, admin: any, teacher: any, class1: any, child: any;

  beforeAll(async () => {
    await prisma.evaluation.deleteMany();
    await prisma.weeklyNote.deleteMany();
    await prisma.incident.deleteMany();
    await prisma.child.deleteMany();
    await prisma.class.deleteMany();
    await prisma.user.deleteMany();

    parent = await prisma.user.create({ data: { email: 'repparent@test.com', passwordHash: 'hash', role: Role.PARENT } });
    teacher = await prisma.user.create({ data: { email: 'repteacher@test.com', passwordHash: 'hash', role: Role.TEACHER } });
    admin = await prisma.user.create({ data: { email: 'repadmin@test.com', passwordHash: 'hash', role: Role.ADMIN } });

    class1 = await prisma.class.create({ data: { name: 'Reporting Class' } });
    await prisma.teacherClass.create({ data: { teacherId: teacher.id, classId: class1.id } });

    child = await prisma.child.create({ data: { name: 'Rep Child', parentId: parent.id, classId: class1.id } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Teacher logs a PRIVATE incident', async () => {
    const res = await request(app)
      .post('/reporting/incidents')
      .set('x-user-id', teacher.id)
      .set('x-role', Role.TEACHER)
      .send({
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
    const res = await request(app)
      .get(`/reporting/incidents/${child.id}`)
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it('Admin requests incidents and DOES see the private incident', async () => {
    const res = await request(app)
      .get(`/reporting/incidents/${child.id}`)
      .set('x-user-id', admin.id)
      .set('x-role', Role.ADMIN);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it('Teacher logs a VISIBLE incident', async () => {
    await request(app)
      .post('/reporting/incidents')
      .set('x-user-id', teacher.id)
      .set('x-role', Role.TEACHER)
      .send({
        childId: child.id,
        date: new Date().toISOString(),
        time: '15:00',
        severity: 'LOW',
        description: 'Scraped knee on playground.',
        isVisibleToParent: true
      });
  });

  it('Parent requests incidents and DOES see the visible incident', async () => {
    const res = await request(app)
      .get(`/reporting/incidents/${child.id}`)
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].severity).toBe('LOW');
  });

  it('Teacher logs an Evaluation', async () => {
    const res = await request(app)
      .post('/reporting/evaluations')
      .set('x-user-id', teacher.id)
      .set('x-role', Role.TEACHER)
      .send({
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
