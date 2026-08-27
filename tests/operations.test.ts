import request from 'supertest';
import express from 'express';
import { prisma } from '../src/core/prisma';
import opsRouter from '../src/api/v1/operations/operations.routes';
import { Role } from '@prisma/client';

const app = express();
app.use(express.json());
// Inject user context based on headers to simulate logged-in session
app.use((req: any, res, next) => {
  req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
  next();
});
app.use('/operations', opsRouter);

describe('Operations API', () => {
  let parent: any, teacher1: any, teacher2: any, class1: any, child: any;

  beforeAll(async () => {
    await prisma.mealRecord.deleteMany();
    await prisma.attendanceRecord.deleteMany();
    await prisma.child.deleteMany();
    await prisma.class.deleteMany();
    await prisma.user.deleteMany();

    parent = await prisma.user.create({ data: { email: 'opsparent@test.com', passwordHash: 'hash', role: Role.PARENT } });
    teacher1 = await prisma.user.create({ data: { email: 'opsteacher1@test.com', passwordHash: 'hash', role: Role.TEACHER } });
    teacher2 = await prisma.user.create({ data: { email: 'opsteacher2@test.com', passwordHash: 'hash', role: Role.TEACHER } });

    class1 = await prisma.class.create({ data: { name: 'Ops Class' } });
    await prisma.teacherClass.create({ data: { teacherId: teacher1.id, classId: class1.id } });

    child = await prisma.child.create({ data: { name: 'Ops Child', parentId: parent.id, classId: class1.id } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Teacher 1 logs attendance for assigned child', async () => {
    const res = await request(app)
      .post('/operations/attendance')
      .set('x-user-id', teacher1.id)
      .set('x-role', Role.TEACHER)
      .send({ childId: child.id, date: new Date().toISOString(), status: 'PRESENT' });
    
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('PRESENT');
  });

  it('Teacher 2 fails to log attendance for unassigned child', async () => {
    const res = await request(app)
      .post('/operations/attendance')
      .set('x-user-id', teacher2.id)
      .set('x-role', Role.TEACHER)
      .send({ childId: child.id, date: new Date().toISOString(), status: 'PRESENT' });
    
    expect(res.status).toBe(403);
  });

  it('Teacher 1 updates (upsert) attendance for same child on same day', async () => {
    const today = new Date().toISOString();
    // First record was logged in the first test
    const res = await request(app)
      .post('/operations/attendance')
      .set('x-user-id', teacher1.id)
      .set('x-role', Role.TEACHER)
      .send({ childId: child.id, date: today, status: 'EXCUSED' }); // Changed status
    
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('EXCUSED');
  });

  it('Parent views meals for their child', async () => {
    // Log a meal first
    await request(app)
      .post('/operations/meals')
      .set('x-user-id', teacher1.id)
      .set('x-role', Role.TEACHER)
      .send({ childId: child.id, date: new Date().toISOString(), type: 'LUNCH', consumed: 'ALL' });

    // Parent fetches
    const res = await request(app)
      .get(`/operations/meals/${child.id}`)
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].type).toBe('LUNCH');
  });
});
