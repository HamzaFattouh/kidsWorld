"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.logMealSchema = exports.logAttendanceSchema = exports.logActivitySchema = exports.getAttendanceSchema = void 0;var _zod = require("zod");

const logAttendanceSchema = exports.logAttendanceSchema = _zod.z.object({
  body: _zod.z.object({
    childId: _zod.z.string().uuid(),
    date: _zod.z.string().datetime(),
    status: _zod.z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    notes: _zod.z.string().optional()
  })
});

const getAttendanceSchema = exports.getAttendanceSchema = _zod.z.object({
  params: _zod.z.object({
    childId: _zod.z.string().uuid()
  }),
  query: _zod.z.object({
    startDate: _zod.z.string().datetime().optional(),
    endDate: _zod.z.string().datetime().optional()
  })
});

const logMealSchema = exports.logMealSchema = _zod.z.object({
  body: _zod.z.object({
    childId: _zod.z.string().uuid(),
    date: _zod.z.string().datetime(),
    type: _zod.z.enum(['BREAKFAST', 'SNACK', 'LUNCH', 'AFTERNOON_SNACK']),
    notes: _zod.z.string().optional(),
    consumed: _zod.z.enum(['ALL', 'SOME', 'NONE']).optional()
  })
});

const logActivitySchema = exports.logActivitySchema = _zod.z.object({
  body: _zod.z.object({
    childId: _zod.z.string().uuid(),
    date: _zod.z.string().datetime(),
    title: _zod.z.string().min(2),
    description: _zod.z.string().optional()
  })
});