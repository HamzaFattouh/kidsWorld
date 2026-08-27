import { NotificationRepository } from '../repositories/NotificationRepository';
import { Prisma } from '@prisma/client';
import { prisma } from '../core/prisma';

export class NotificationService {
  constructor(private notifRepo = new NotificationRepository()) {}

  async registerDevice(userId: string, token: string, type: string) {
    return this.notifRepo.registerDeviceToken(userId, token, type);
  }

  async removeDevice(token: string) {
    return this.notifRepo.removeDeviceToken(token);
  }

  async updatePreferences(userId: string, type: string, isPushEnabled: boolean, isInAppEnabled: boolean) {
    return this.notifRepo.upsertPreference(userId, type, isPushEnabled, isInAppEnabled);
  }

  async getPreferences(userId: string) {
    return this.notifRepo.getPreferences(userId);
  }

  async getInbox(userId: string) {
    return this.notifRepo.getInbox(userId);
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notifRepo.markAsRead(notificationId, userId);
  }

  /**
   * Internal Event Dispatcher
   */
  async dispatch(
    userIds: string[], 
    type: string, 
    titleEn: string, titleAr: string, 
    bodyEn: string, bodyAr: string, 
    payload?: string
  ) {
    const tokens = await this.notifRepo.getDeviceTokensForUsers(userIds);
    const users = await prisma.user.findMany({ where: { id: { in: userIds } } });

    for (const user of users) {
      const prefs = await prisma.notificationPreference.findUnique({
        where: { userId_type: { userId: user.id, type } }
      });

      // Default true if not explicitly set
      const pushEnabled = prefs ? prefs.isPushEnabled : true;
      const inAppEnabled = prefs ? prefs.isInAppEnabled : true;

      if (inAppEnabled) {
        await this.notifRepo.createNotification({
          userId: user.id,
          titleEn, titleAr, bodyEn, bodyAr, dataPayload: payload
        });
      }

      if (pushEnabled) {
        const userTokens = tokens.filter(t => t.userId === user.id);
        const title = user.locale === 'ar' ? titleAr : titleEn;
        const body = user.locale === 'ar' ? bodyAr : bodyEn;

        // Mock FCM push delivery. 
        // If an invalid token error is thrown by the real firebase-admin, 
        // we would call `this.removeDevice(token)` to clean it up.
        console.log(`[Push -> ${user.email}] (${userTokens.length} devices) ${title}: ${body}`);
      }
    }
  }
}
