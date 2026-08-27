import { prisma } from '../../src/core/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export const seedDatabase = async () => {
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  console.log('Seeding database with deterministic test data...');

  // Admins
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kidsworld.test' },
    update: {},
    create: {
      id: 'usr_admin_1',
      email: 'admin@kidsworld.test',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      firstName: 'System',
      lastName: 'Admin',
      isActive: true,
    }
  });

  // Teachers
  const teacherA = await prisma.user.upsert({
    where: { email: 'teacher.a@kidsworld.test' },
    update: {},
    create: {
      id: 'usr_teacher_a',
      email: 'teacher.a@kidsworld.test',
      passwordHash: hashedPassword,
      role: Role.TEACHER,
      firstName: 'Teacher',
      lastName: 'A',
      isActive: true,
    }
  });

  const teacherB = await prisma.user.upsert({
    where: { email: 'teacher.b@kidsworld.test' },
    update: {},
    create: {
      id: 'usr_teacher_b',
      email: 'teacher.b@kidsworld.test',
      passwordHash: hashedPassword,
      role: Role.TEACHER,
      firstName: 'Teacher',
      lastName: 'B',
      isActive: true,
    }
  });

  // Parents
  const parentA = await prisma.user.upsert({
    where: { email: 'parent.a@kidsworld.test' },
    update: {},
    create: {
      id: 'usr_parent_a',
      email: 'parent.a@kidsworld.test',
      passwordHash: hashedPassword,
      role: Role.PARENT,
      firstName: 'Parent',
      lastName: 'A',
      isActive: true,
    }
  });

  const parentB = await prisma.user.upsert({
    where: { email: 'parent.b@kidsworld.test' },
    update: {},
    create: {
      id: 'usr_parent_b',
      email: 'parent.b@kidsworld.test',
      passwordHash: hashedPassword,
      role: Role.PARENT,
      firstName: 'Parent',
      lastName: 'B',
      isActive: true,
    }
  });

  // Classes
  const classA = await prisma.teacherClass.upsert({
    where: { id: 'cls_toddlers_a' },
    update: {},
    create: {
      id: 'cls_toddlers_a',
      name: 'Toddlers A',
      teacherId: teacherA.id,
      ageGroup: '2-3',
      capacity: 15,
    }
  });

  const classB = await prisma.teacherClass.upsert({
    where: { id: 'cls_preschool_b' },
    update: {},
    create: {
      id: 'cls_preschool_b',
      name: 'Preschool B',
      teacherId: teacherB.id,
      ageGroup: '3-4',
      capacity: 15,
    }
  });

  // Children
  const childA = await prisma.child.upsert({
    where: { id: 'child_a_1' },
    update: {},
    create: {
      id: 'child_a_1',
      firstName: 'Child',
      lastName: 'A',
      dateOfBirth: new Date('2022-01-01'),
      classId: classA.id,
      parentId: parentA.id,
      medicalInfo: 'Peanut allergy',
    }
  });

  const childB = await prisma.child.upsert({
    where: { id: 'child_b_1' },
    update: {},
    create: {
      id: 'child_b_1',
      firstName: 'Child',
      lastName: 'B',
      dateOfBirth: new Date('2021-05-15'),
      classId: classB.id,
      parentId: parentA.id,
    }
  });

  const childC = await prisma.child.upsert({
    where: { id: 'child_c_1' },
    update: {},
    create: {
      id: 'child_c_1',
      firstName: 'Child',
      lastName: 'C',
      dateOfBirth: new Date('2021-11-20'),
      classId: classB.id,
      parentId: parentB.id,
    }
  });

  console.log('Test seeding completed successfully.');
  
  return {
    admin, teacherA, teacherB, parentA, parentB, classA, classB, childA, childB, childC
  };
};
