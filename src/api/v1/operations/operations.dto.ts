import { z } from 'zod';

export const logAttendanceSchema = z.object({
  body: z.object({
    childId: z.string().uuid(),
    date: z.string().datetime(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    notes: z.string().optional()
  })
});

export const getAttendanceSchema = z.object({
  params: z.object({
    childId: z.string().uuid()
  }),
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })
});

export const logMealSchema = z.object({
  body: z.object({
    childId: z.string().uuid(),
    date: z.string().datetime(),
    type: z.enum(['BREAKFAST', 'SNACK', 'LUNCH', 'AFTERNOON_SNACK']),
    notes: z.string().optional(),
    consumed: z.enum(['ALL', 'SOME', 'NONE']).optional()
  })
});

export const logActivitySchema = z.object({
  body: z.object({
    childId: z.string().uuid(),
    date: z.string().datetime(),
    title: z.string().min(2),
    description: z.string().optional()
  })
});
