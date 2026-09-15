"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
var _prisma = require("../core/prisma");
const { dbStore } = require('../core/db/persistentStore');

class UserRepository {
  async create(data) {
    try {
      const dbUser = await _prisma.prisma.user.create({ data });
      if (dbUser) {
        dbStore.insert('users', dbUser);
        return dbUser;
      }
    } catch (e) {
      console.warn('[DB] Prisma offline, persisting user to local database.json store');
    }
    const newUser = {
      id: `user-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
    return dbStore.insert('users', newUser);
  }

  async findByEmail(email) {
    try {
      const user = await _prisma.prisma.user.findUnique({ where: { email } });
      if (user) return user;
    } catch (e) {
      // offline fallback
    }
    const cleanEmail = (email || '').toLowerCase();
    return dbStore.find('users', (u) => u.email.toLowerCase() === cleanEmail);
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
      // offline fallback
    }
    const cleanId = (identifier || '').toLowerCase();
    return dbStore.find(
      'users',
      (u) =>
        u.email.toLowerCase() === cleanId ||
        (u.name && u.name.toLowerCase() === cleanId) ||
        (cleanId === 'admin' && u.role === 'ADMIN') ||
        (cleanId === 'teacher' && u.role === 'TEACHER') ||
        (cleanId === 'parent' && u.role === 'PARENT')
    );
  }

  async findById(id) {
    try {
      const user = await _prisma.prisma.user.findUnique({ where: { id } });
      if (user) return user;
    } catch (e) {
      // offline fallback
    }
    return dbStore.find('users', (u) => u.id === id);
  }

  async update(id, data) {
    try {
      const updated = await _prisma.prisma.user.update({ where: { id }, data });
      if (updated) {
        dbStore.update('users', 'id', id, updated);
        return updated;
      }
    } catch (e) {
      console.warn('[DB] Prisma offline, updating user in local database.json store');
    }
    return dbStore.update('users', 'id', id, data);
  }

  async findMany(options) {
    try {
      const list = await _prisma.prisma.user.findMany({
        where: options?.where,
        skip: options?.skip,
        take: options?.take,
        orderBy: options?.orderBy,
      });
      if (list && list.length > 0) return list;
    } catch (e) {
      console.warn('[DB] Prisma offline, fetching users from local database.json store');
    }
    let users = dbStore.get('users');
    if (options?.where?.role) {
      users = users.filter((u) => u.role === options.where.role);
    }
    return users;
  }
}
exports.UserRepository = UserRepository;