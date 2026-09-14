"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.NotificationService = void 0;var _NotificationRepository = require("../repositories/NotificationRepository");

var _prisma = require("../core/prisma");

class NotificationService {
  constructor(notifRepo = new _NotificationRepository.NotificationRepository()) {this.notifRepo = notifRepo;}

  async registerDevice(userId, token, type) {
    return this.notifRepo.registerDeviceToken(userId, token, type);
  }

  async removeDevice(token) {
    return this.notifRepo.removeDeviceToken(token);
  }

  async updatePreferences(userId, type, isPushEnabled, isInAppEnabled) {
    return this.notifRepo.upsertPreference(userId, type, isPushEnabled, isInAppEnabled);
  }

  async getPreferences(userId) {
    return this.notifRepo.getPreferences(userId);
  }

  async getInbox(userId) {
    return this.notifRepo.getInbox(userId);
  }

  async markAsRead(notificationId, userId) {
    return this.notifRepo.markAsRead(notificationId, userId);
  }

  /**
   * Internal Event Dispatcher
   */
  async dispatch(
  userIds,
  type,
  titleEn, titleAr,
  bodyEn, bodyAr,
  payload)
  {
    const tokens = await this.notifRepo.getDeviceTokensForUsers(userIds);
    const users = await _prisma.prisma.user.findMany({ where: { id: { in: userIds } } });

    for (const user of users) {
      const prefs = await _prisma.prisma.notificationPreference.findUnique({
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
        const userTokens = tokens.filter((t) => t.userId === user.id);
        const title = user.locale === 'ar' ? titleAr : titleEn;
        const body = user.locale === 'ar' ? bodyAr : bodyEn;

        // Mock FCM push delivery. 
        // If an invalid token error is thrown by the real firebase-admin, 
        // we would call `this.removeDevice(token)` to clean it up.
        console.log(`[Push -> ${user.email}] (${userTokens.length} devices) ${title}: ${body}`);
      }
    }
  }
}exports.NotificationService = NotificationService;