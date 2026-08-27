import request from 'supertest';
import express from 'express';
import { prisma } from '../src/core/prisma';
import coreRouter from '../src/api/v1/core/core.routes';
import { Role } from '@prisma/client';

// Minimal mock setup to bypass session generation for quick integration testing
const app = express();
app.use(express.json());
// Inject user context based on headers to simulate logged-in session
app.use((req: any, res, next) => {
  req.user = { userId: req.headers['x-user-id'], role: req.headers['x-role'] };
  next();
});
app.use('/core', coreRouter);

// We mock requirePermission and requireOwnership in authorize.ts for testing via jest.mock or similar
// But here we rely on the actual authz middleware logic which requires DB relationships!

describe('Core Entities API', () => {
  let admin: any, parent: any, teacher: any, class1: any, child: any;

  beforeAll(async () => {
    await prisma.child.deleteMany();
    await prisma.class.deleteMany();
    await prisma.user.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();

    // Setup Admin
    admin = await prisma.user.create({ data: { email: 'coreadmin@test.com', passwordHash: 'hash', role: Role.ADMIN } });
    
    // Setup Permission for manage:classes and manage:children
    const p1 = await prisma.permission.create({ data: { action: 'manage:classes' } });
    const p2 = await prisma.permission.create({ data: { action: 'manage:children' } });
    await prisma.rolePermission.create({ data: { role: Role.ADMIN, permissionId: p1.id } });
    await prisma.rolePermission.create({ data: { role: Role.ADMIN, permissionId: p2.id } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Admin can create a Class', async () => {
    const res = await request(app)
      .post('/core/classes')
      .set('x-user-id', admin.id)
      .set('x-role', Role.ADMIN)
      .send({ name: 'Lions', capacity: 15, ageGroup: '3-4' });
    
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Lions');
    class1 = res.body.data;
  });

  it('Admin can create a Parent and Child', async () => {
    parent = await prisma.user.create({ data: { email: 'coreparent@test.com', passwordHash: 'hash', role: Role.PARENT } });
    
    const res = await request(app)
      .post('/core/children')
      .set('x-user-id', admin.id)
      .set('x-role', Role.ADMIN)
      .send({ name: 'Leo', parentId: parent.id, classId: class1.id });
    
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Leo');
    child = res.body.data;
  });

  it('Parent can list only their children', async () => {
    const res = await request(app)
      .get('/core/children')
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toBe(child.id);
  });

  it('Parent gets 403 when creating a class', async () => {
    const res = await request(app)
      .post('/core/classes')
      .set('x-user-id', parent.id)
      .set('x-role', Role.PARENT)
      .send({ name: 'Tigers' });
    
    expect(res.status).toBe(403);
  });
});
