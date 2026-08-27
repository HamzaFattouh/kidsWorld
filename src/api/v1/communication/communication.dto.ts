import { z } from 'zod';

export const createComplaintSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    childId: z.string().uuid().optional()
  })
});

export const createRequestSchema = z.object({
  body: z.object({
    type: z.enum(['LEAVE', 'EARLY_PICKUP', 'PROFILE_UPDATE', 'DOCUMENT_REQUEST', 'MEETING_REQUEST']),
    description: z.string().min(5),
    childId: z.string().uuid().optional()
  })
});

export const sendMessageSchema = z.object({
  body: z.object({
    receiverId: z.string().uuid(),
    content: z.string().min(1)
  })
});
