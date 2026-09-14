"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.queryUsersSchema = exports.createUserSchema = void 0;var _zod = require("zod");

const createUserSchema = exports.createUserSchema = _zod.z.object({
  body: _zod.z.object({
    name: _zod.z.string().min(2, 'Name must be at least 2 characters'),
    password: _zod.z.string().min(8, 'Password must be at least 8 characters long'),
    role: _zod.z.enum(['ADMIN', 'TEACHER', 'PARENT'], { required_error: 'Role is required' }),
    email: _zod.z.string().optional().or(_zod.z.literal('')),
    phone: _zod.z.string().optional(),
    nationalId: _zod.z.string().optional(),
    address: _zod.z.string().optional(),
    isActive: _zod.z.boolean().optional().default(true),
    requiresPasswordChange: _zod.z.boolean().optional().default(true)
  })
});

const queryUsersSchema = exports.queryUsersSchema = _zod.z.object({
  query: _zod.z.object({
    page: _zod.z.string().optional(),
    limit: _zod.z.string().optional(),
    role: _zod.z.enum(['ADMIN', 'TEACHER', 'PARENT']).optional(),
    search: _zod.z.string().optional()
  })
});