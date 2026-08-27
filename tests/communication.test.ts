import request from 'supertest';
import express from 'express';
import { prisma } from '../src/core/prisma';
import commRouter from '../src/api/v1/communication/communication.routes';
import { Role } from '@prisma/client';

const app = express();
app.use(express.json());
// Inject user context based on headers to simulate logged-in session
app.use((req: any, res, next) => {
  req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
  next();
});
app.use('/communication', commRouter);

describe('Communication API', () => {
  let parent: any, teacher: any, admin: any, otherTeacher: any, class1: any, child: any;

  beforeAll(async () => {
    await prisma.message.deleteMany();
    await prisma.parentRequest.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.child.deleteMany();
    await prisma.class.deleteMany();
    await prisma.user.deleteMany();

    parent = await prisma.user.create({ data: { email: 'commparent@test.com', passwordHash: 'hash', role: Role.PARENT } });
    teacher = await prisma.user.create({ data: { email: 'commteacher@test.com', passwordHash: 'hash', role: Role.TEACHER } });
    otherTeacher = await prisma.user.create({ data: { email: 'otherteacher@test.com', passwordHash: 'hash', role: Role.TEACHER } });
    admin = await prisma.user.create({ data: { email: 'commadmin@test.com', passwordHash: 'hash', role: Role.ADMIN } });

    class1 = await prisma.class.create({ data: { name: 'Comm Class' } });
    await prisma.teacherClass.create({ data: { teacherId: teacher.id, classId: class1.id } });

    child = await prisma.child.create({ data: { name: 'Comm Child', parentId: parent.id, classId: class1.id } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Parent submits a LEAVE request', async () => {
    const res = await request(app)
      .post('/communication/requests')
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT)
      .send({
        childId: child.id,
        type: 'LEAVE',
        description: 'Going on vacation next week.'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.data.type).toBe('LEAVE');
  });

  it('Parent successfully sends a message to assigned Teacher', async () => {
    const res = await request(app)
      .post('/communication/messages')
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT)
      .send({
        receiverId: teacher.id,
        content: 'Hello, how is my child doing?'
      });
    
    expect(res.status).toBe(201);
  });

  it('Parent gets 403 Forbidden when trying to message unassigned Teacher', async () => {
    const res = await request(app)
      .post('/communication/messages')
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT)
      .send({
        receiverId: otherTeacher.id,
        content: 'Hello, are you my childs new teacher?'
      });
    
    expect(res.status).toBe(403);
  });

  it('Admin retrieves all complaints (even if none exist yet, checking endpoint)', async () => {
    const res = await request(app)
      .get('/communication/complaints')
      .set('x-user-id', admin.id)
      .set('x-role', Role.ADMIN);
    
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
