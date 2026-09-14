"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.createWeeklyNoteSchema = exports.createIncidentSchema = exports.createEvaluationSchema = void 0;var _zod = require("zod");

const createIncidentSchema = exports.createIncidentSchema = _zod.z.object({
  body: _zod.z.object({
    childId: _zod.z.string().uuid(),
    date: _zod.z.string().datetime(),
    time: _zod.z.string().min(4),
    severity: _zod.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    description: _zod.z.string().min(5),
    actionTaken: _zod.z.string().optional(),
    followUp: _zod.z.string().optional(),
    isVisibleToParent: _zod.z.boolean().default(false)
  })
});

const createWeeklyNoteSchema = exports.createWeeklyNoteSchema = _zod.z.object({
  body: _zod.z.object({
    childId: _zod.z.string().uuid(),
    weekStartDate: _zod.z.string().datetime(),
    behavior: _zod.z.string().optional(),
    participation: _zod.z.string().optional(),
    socialSkills: _zod.z.string().optional(),
    communication: _zod.z.string().optional(),
    learning: _zod.z.string().optional(),
    activities: _zod.z.string().optional(),
    generalNotes: _zod.z.string().optional()
  })
});

const Rating = _zod.z.number().int().min(1).max(5);

const createEvaluationSchema = exports.createEvaluationSchema = _zod.z.object({
  body: _zod.z.object({
    childId: _zod.z.string().uuid(),
    term: _zod.z.string().min(2),
    learning: Rating,
    communication: Rating,
    socialSkills: Rating,
    participation: Rating,
    behavior: Rating,
    creativity: Rating,
    motorSkills: Rating
  })
});