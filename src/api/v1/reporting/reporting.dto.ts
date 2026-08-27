import { z } from 'zod';

export const createIncidentSchema = z.object({
  body: z.object({
    childId: z.string().uuid(),
    date: z.string().datetime(),
    time: z.string().min(4),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    description: z.string().min(5),
    actionTaken: z.string().optional(),
    followUp: z.string().optional(),
    isVisibleToParent: z.boolean().default(false)
  })
});

export const createWeeklyNoteSchema = z.object({
  body: z.object({
    childId: z.string().uuid(),
    weekStartDate: z.string().datetime(),
    behavior: z.string().optional(),
    participation: z.string().optional(),
    socialSkills: z.string().optional(),
    communication: z.string().optional(),
    learning: z.string().optional(),
    activities: z.string().optional(),
    generalNotes: z.string().optional(),
  })
});

const Rating = z.number().int().min(1).max(5);

export const createEvaluationSchema = z.object({
  body: z.object({
    childId: z.string().uuid(),
    term: z.string().min(2),
    learning: Rating,
    communication: Rating,
    socialSkills: Rating,
    participation: Rating,
    behavior: Rating,
    creativity: Rating,
    motorSkills: Rating
  })
});
