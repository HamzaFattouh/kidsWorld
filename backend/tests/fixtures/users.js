"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.mockUsers = exports.getMockTokenForRole = void 0; // tests/fixtures/users.ts

const mockUsers = exports.mockUsers = {
  admin: {
    id: 'user-admin-001',
    email: 'admin@kidsworld.com',
    role: 'ADMIN',
    isActive: true
  },
  teacher: {
    id: 'user-teacher-001',
    email: 'teacher@kidsworld.com',
    role: 'TEACHER',
    isActive: true
  },
  parent: {
    id: 'user-parent-001',
    email: 'parent@kidsworld.com',
    role: 'PARENT',
    isActive: true
  }
};

const getMockTokenForRole = (role) => {
  // In real integration tests, this might hit a login endpoint or sign a raw JWT
  return `mock.jwt.token.for.${role.toLowerCase()}`;
};exports.getMockTokenForRole = getMockTokenForRole;