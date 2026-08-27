import request from 'supertest';
import express from 'express';
import { prisma } from '../src/core/prisma';
import { requirePermission, requireOwnership } from '../src/api/middlewares/authorize';
import { Role } from '@prisma/client';

// Setup Mock App
const app = express();
app.use(express.json());

// Mock requireAuth middleware to inject user roles directly for testing
const mockRequireAuth = (role: Role, userId: string) => (req: any, res: any, next: any) => {
  req.user = { userId, role };
  next();
};

// Admin routes
app.get('/admin-only', mockRequireAuth(Role.PARENT, 'parentA'), requirePermission('manage:users'), (req, res) => res.json({ ok: true }));
app.get('/teacher-admin-only', mockRequireAuth(Role.TEACHER, 'teacherA'), requirePermission('manage:users'), (req, res) => res.json({ ok: true }));

// Child Resource routes
app.get('/child/:id', 
  (req, res, next) => {
    // Dynamically inject the user based on headers to test different users on same route
    req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
    next();
  },
  requireOwnership('child'),
  (req, res) => res.json({ ok: true })
);

describe('Authorization Engine', () => {
  let admin: any, parentA: any, parentB: any, teacherA: any, teacherB: any;
  let class1: any, class2: any;
  let childA: any, childB: any;
  let permission: any;

  beforeAll(async () => {
    // Clear DB
    await prisma.child.deleteMany();
    await prisma.teacherClass.deleteMany();
    await prisma.class.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.user.deleteMany();

    // Create Permission
    permission = await prisma.permission.create({ data: { action: 'manage:users' } });
    await prisma.rolePermission.create({ data: { role: Role.ADMIN, permissionId: permission.id } });
    
    // Create Users
    admin = await prisma.user.create({ data: { email: 'admin@test.com', passwordHash: 'hash', role: Role.ADMIN } });
    parentA = await prisma.user.create({ data: { email: 'parentA@test.com', passwordHash: 'hash', role: Role.PARENT } });
    parentB = await prisma.user.create({ data: { email: 'parentB@test.com', passwordHash: 'hash', role: Role.PARENT } });
    teacherA = await prisma.user.create({ data: { email: 'teacherA@test.com', passwordHash: 'hash', role: Role.TEACHER } });
    teacherB = await prisma.user.create({ data: { email: 'teacherB@test.com', passwordHash: 'hash', role: Role.TEACHER } });

    // Create Classes
    class1 = await prisma.class.create({ data: { name: 'Class 1' } });
    class2 = await prisma.class.create({ data: { name: 'Class 2' } });

    // Assign Teachers
    await prisma.teacherClass.create({ data: { teacherId: teacherA.id, classId: class1.id } });
    await prisma.teacherClass.create({ data: { teacherId: teacherB.id, classId: class2.id } });

    // Create Children
    childA = await prisma.child.create({ data: { name: 'Child A', parentId: parentA.id, classId: class1.id } });
    childB = await prisma.child.create({ data: { name: 'Child B', parentId: parentB.id, classId: class2.id } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Parent cannot access admin APIs', async () => {
    const res = await request(app).get('/admin-only');
    expect(res.status).toBe(403);
    expect(res.text).toContain('missing permission');
  });

  it('Teacher cannot access admin APIs', async () => {
    const res = await request(app).get('/teacher-admin-only');
    expect(res.status).toBe(403);
    expect(res.text).toContain('missing permission');
  });

  it('Parent A can access Child A', async () => {
    const res = await request(app)
      .get(`/child/${childA.id}`)
      .set('x-user-id', parentA.id)
      .set('x-role', Role.PARENT);
    expect(res.status).toBe(200);
  });

  it('Parent A CANNOT access Child B', async () => {
    const res = await request(app)
      .get(`/child/${childB.id}`)
      .set('x-user-id', parentA.id)
      .set('x-role', Role.PARENT);
    expect(res.status).toBe(403);
  });

  it('Teacher A can access Child A (in Class 1)', async () => {
    const res = await request(app)
      .get(`/child/${childA.id}`)
      .set('x-user-id', teacherA.id)
      .set('x-role', Role.TEACHER);
    expect(res.status).toBe(200);
  });

  it('Teacher A CANNOT access Child B (in Class 2)', async () => {
    const res = await request(app)
      .get(`/child/${childB.id}`)
      .set('x-user-id', teacherA.id)
      .set('x-role', Role.TEACHER);
    expect(res.status).toBe(403);
  });

  it('Admin can access any Child', async () => {
    const res = await request(app)
      .get(`/child/${childB.id}`)
      .set('x-user-id', admin.id)
      .set('x-role', Role.ADMIN);
    expect(res.status).toBe(200);
  });
});
