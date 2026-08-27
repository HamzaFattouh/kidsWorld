import { z } from 'zod';

export const querySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
    limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
    classId: z.string().uuid().optional(),
    parentId: z.string().uuid().optional(),
  })
});

export const createChildSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    parentId: z.string().uuid(),
    classId: z.string().uuid(),
    dob: z.string().datetime().optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    medicalNotes: z.string().optional(),
  })
});

export const createClassSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    branchId: z.string().optional(),
    capacity: z.number().min(1).max(100).optional(),
    ageGroup: z.string().optional(),
  })
});

export const addContactSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(6),
    relation: z.string().min(2),
  })
});
