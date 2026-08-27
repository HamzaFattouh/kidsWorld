import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  body: z.object({
    titleEn: z.string().min(3),
    titleAr: z.string().min(3),
    contentEn: z.string().min(5),
    contentAr: z.string().min(5),
    priority: z.enum(['NORMAL', 'HIGH', 'URGENT']).optional(),
    isPublished: z.boolean().optional()
  })
});

export const createPostSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid(),
    titleEn: z.string().min(3),
    titleAr: z.string().min(3),
    contentEn: z.string().min(10),
    contentAr: z.string().min(10),
    isPublished: z.boolean().optional()
  })
});
