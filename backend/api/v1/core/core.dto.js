"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.querySchema = exports.createClassSchema = exports.createChildSchema = exports.addContactSchema = void 0;var _zod = require("zod");

const querySchema = exports.querySchema = _zod.z.object({
  query: _zod.z.object({
    page: _zod.z.string().optional().transform((v) => v ? parseInt(v, 10) : 1),
    limit: _zod.z.string().optional().transform((v) => v ? parseInt(v, 10) : 10),
    classId: _zod.z.string().uuid().optional(),
    parentId: _zod.z.string().uuid().optional()
  })
});

const createChildSchema = exports.createChildSchema = _zod.z.object({
  body: _zod.z.object({
    name: _zod.z.string().min(2),
    parentId: _zod.z.string().uuid(),
    classId: _zod.z.string().uuid(),
    dob: _zod.z.string().datetime().optional(),
    gender: _zod.z.enum(['MALE', 'FEMALE']).optional(),
    medicalNotes: _zod.z.string().optional()
  })
});

const createClassSchema = exports.createClassSchema = _zod.z.object({
  body: _zod.z.object({
    name: _zod.z.string().min(2),
    branchId: _zod.z.string().optional(),
    capacity: _zod.z.number().min(1).max(100).optional(),
    ageGroup: _zod.z.string().optional()
  })
});

const addContactSchema = exports.addContactSchema = _zod.z.object({
  body: _zod.z.object({
    name: _zod.z.string().min(2),
    phone: _zod.z.string().min(6),
    relation: _zod.z.string().min(2)
  })
});