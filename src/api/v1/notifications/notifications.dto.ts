import { z } from 'zod';

export const registerDeviceSchema = z.object({
  body: z.object({
    token: z.string().min(10),
    deviceType: z.enum(['IOS', 'ANDROID', 'WEB'])
  })
});

export const updatePreferenceSchema = z.object({
  body: z.object({
    type: z.string().min(2),
    isPushEnabled: z.boolean(),
    isInAppEnabled: z.boolean()
  })
});
