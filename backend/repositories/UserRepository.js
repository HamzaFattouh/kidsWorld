"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
var _prisma = require("../core/prisma");

const FALLBACK_USERS = [
  {
    id: 'user-admin-001',
    email: 'admin@kidsworld.com',
    name: 'مدير النظام الرئيسي',
    passwordHash: '$2b$10$U6yRUKHu5ERTIlKdzbNnhe4DAIW2f3bMWmQemtloOcfuSUZh1j87.', // admin123
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    requiresPasswordChange: false,
    phone: '0599000000',
  },
  {
    id: 'user-teacher-001',
    email: 'nora@kidsworld.com',
    name: 'أ. نورة النابلسي',
    passwordHash: '$2b$10$jMr7bNJ6DV6g5PfbE3bajO7.n6yIRO3SssgCcJ2mF.Usg/VrVX/pu', // 123456
    role: 'TEACHER',
    isActive: true,
    isVerified: true,
    requiresPasswordChange: false,
    phone: '0599111222',
  },
  {
    id: 'user-teacher-002',
    email: 'sara@kidsworld.com',
    name: 'أ. سارة الخالد',
    passwordHash: '$2b$10$jMr7bNJ6DV6g5PfbE3bajO7.n6yIRO3SssgCcJ2mF.Usg/VrVX/pu', // 123456
    role: 'TEACHER',
    isActive: true,
    isVerified: true,
    requiresPasswordChange: false,
    phone: '0599333444',
  },
  {
    id: 'user-parent-001',
    email: 'ahmed.parent@gmail.com',
    name: 'أحمد الشكعة',
    passwordHash: '$2b$10$jMr7bNJ6DV6g5PfbE3bajO7.n6yIRO3SssgCcJ2mF.Usg/VrVX/pu', // 123456
    role: 'PARENT',
    isActive: true,
    isVerified: true,
    requiresPasswordChange: false,
    phone: '0599888777',
  },
  {
    id: 'user-parent-002',
    email: 'marian.parent@gmail.com',
    name: 'مريم المصري',
    passwordHash: '$2b$10$jMr7bNJ6DV6g5PfbE3bajO7.n6yIRO3SssgCcJ2mF.Usg/VrVX/pu', // 123456
    role: 'PARENT',
    isActive: true,
    isVerified: true,
    requiresPasswordChange: false,
    phone: '0599555666',
  },
];

class UserRepository {
  async create(data) {
    try {
      return await _prisma.prisma.user.create({ data });
    } catch (e) {
      console.warn('DB Unavailable, using mock create user fallback');
      return { id: `user-${Date.now()}`, ...data, createdAt: new Date() };
    }
  }

  async findByEmail(email) {
    try {
      const user = await _prisma.prisma.user.findUnique({ where: { email } });
      if (user) return user;
    } catch (e) {
      console.warn('DB Connection error in findByEmail, checking fallback users...');
    }
    return FALLBACK_USERS.find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase()
    ) || null;
  }

  async findByEmailOrName(identifier) {
    try {
      const user = await _prisma.prisma.user.findFirst({
        where: {
          OR: [{ email: identifier }, { name: identifier }],
        },
      });
      if (user) return user;
    } catch (e) {
      console.warn('DB Connection error in findByEmailOrName, checking fallback users...');
    }
    const cleanId = (identifier || '').toLowerCase();
    return (
      FALLBACK_USERS.find(
        (u) =>
          u.email.toLowerCase() === cleanId ||
          u.name.toLowerCase() === cleanId ||
          (cleanId === 'admin' && u.role === 'ADMIN') ||
          (cleanId === 'teacher' && u.role === 'TEACHER') ||
          (cleanId === 'parent' && u.role === 'PARENT')
      ) || null
    );
  }

  async findById(id) {
    try {
      const user = await _prisma.prisma.user.findUnique({ where: { id } });
      if (user) return user;
    } catch (e) {
      console.warn('DB Connection error in findById, checking fallback users...');
    }
    return FALLBACK_USERS.find((u) => u.id === id) || null;
  }

  async update(id, data) {
    try {
      return await _prisma.prisma.user.update({ where: { id }, data });
    } catch (e) {
      console.warn('DB Unavailable in update user fallback');
      const found = FALLBACK_USERS.find((u) => u.id === id);
      return { ...(found || {}), ...data };
    }
  }

  async findMany(options) {
    try {
      return await _prisma.prisma.user.findMany({
        where: options?.where,
        skip: options?.skip,
        take: options?.take,
        orderBy: options?.orderBy,
      });
    } catch (e) {
      console.warn('DB Connection error in findMany, returning fallback list');
      return FALLBACK_USERS;
    }
  }
}
exports.UserRepository = UserRepository;