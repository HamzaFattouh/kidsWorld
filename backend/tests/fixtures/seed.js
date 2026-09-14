"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.seedDatabase = void 0;var _prisma = require("../../backend/core/prisma");
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _client = require("@prisma/client");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const seedDatabase = async () => {
  const hashedPassword = await _bcrypt.default.hash('Password123!', 10);

  console.log('Seeding database with deterministic test data...');

  // Admins
  const admin = await _prisma.prisma.user.upsert({
    where: { email: 'admin@kidsworld.test' },
    update: {},
    create: {
      id: 'usr_admin_1',
      email: 'admin@kidsworld.test',
      passwordHash: hashedPassword,
      role: _client.Role.ADMIN,
      firstName: 'System',
      lastName: 'Admin',
      isActive: true
    }
  });

  // Teachers
  const teacherA = await _prisma.prisma.user.upsert({
    where: { email: 'teacher.a@kidsworld.test' },
    update: {},
    create: {
      id: 'usr_teacher_a',
      email: 'teacher.a@kidsworld.test',
      passwordHash: hashedPassword,
      role: _client.Role.TEACHER,
      firstName: 'Teacher',
      lastName: 'A',
      isActive: true
    }
  });

  const teacherB = await _prisma.prisma.user.upsert({
    where: { email: 'teacher.b@kidsworld.test' },
    update: {},
    create: {
      id: 'usr_teacher_b',
      email: 'teacher.b@kidsworld.test',
      passwordHash: hashedPassword,
      role: _client.Role.TEACHER,
      firstName: 'Teacher',
      lastName: 'B',
      isActive: true
    }
  });

  // Parents
  const parentA = await _prisma.prisma.user.upsert({
    where: { email: 'parent.a@kidsworld.test' },
    update: {},
    create: {
      id: 'usr_parent_a',
      email: 'parent.a@kidsworld.test',
      passwordHash: hashedPassword,
      role: _client.Role.PARENT,
      firstName: 'Parent',
      lastName: 'A',
      isActive: true
    }
  });

  const parentB = await _prisma.prisma.user.upsert({
    where: { email: 'parent.b@kidsworld.test' },
    update: {},
    create: {
      id: 'usr_parent_b',
      email: 'parent.b@kidsworld.test',
      passwordHash: hashedPassword,
      role: _client.Role.PARENT,
      firstName: 'Parent',
      lastName: 'B',
      isActive: true
    }
  });

  // Classes
  const classA = await _prisma.prisma.teacherClass.upsert({
    where: { id: 'cls_toddlers_a' },
    update: {},
    create: {
      id: 'cls_toddlers_a',
      name: 'Toddlers A',
      teacherId: teacherA.id,
      ageGroup: '2-3',
      capacity: 15
    }
  });

  const classB = await _prisma.prisma.teacherClass.upsert({
    where: { id: 'cls_preschool_b' },
    update: {},
    create: {
      id: 'cls_preschool_b',
      name: 'Preschool B',
      teacherId: teacherB.id,
      ageGroup: '3-4',
      capacity: 15
    }
  });

  // Children
  const childA = await _prisma.prisma.child.upsert({
    where: { id: 'child_a_1' },
    update: {},
    create: {
      id: 'child_a_1',
      firstName: 'Child',
      lastName: 'A',
      dateOfBirth: new Date('2022-01-01'),
      classId: classA.id,
      parentId: parentA.id,
      medicalInfo: 'Peanut allergy'
    }
  });

  const childB = await _prisma.prisma.child.upsert({
    where: { id: 'child_b_1' },
    update: {},
    create: {
      id: 'child_b_1',
      firstName: 'Child',
      lastName: 'B',
      dateOfBirth: new Date('2021-05-15'),
      classId: classB.id,
      parentId: parentA.id
    }
  });

  const childC = await _prisma.prisma.child.upsert({
    where: { id: 'child_c_1' },
    update: {},
    create: {
      id: 'child_c_1',
      firstName: 'Child',
      lastName: 'C',
      dateOfBirth: new Date('2021-11-20'),
      classId: classB.id,
      parentId: parentB.id
    }
  });

  console.log('Test seeding completed successfully.');

  return {
    admin, teacherA, teacherB, parentA, parentB, classA, classB, childA, childB, childC
  };
};exports.seedDatabase = seedDatabase;