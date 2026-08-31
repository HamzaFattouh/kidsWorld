import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    role: z.enum(['ADMIN', 'TEACHER', 'PARENT'], { required_error: 'Role is required' }),
    isActive: z.boolean().optional().default(true),
    requiresPasswordChange: z.boolean().optional().default(true),
  }),
});

export const queryUsersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'PARENT']).optional(),
    search: z.string().optional(),
  }),
});
