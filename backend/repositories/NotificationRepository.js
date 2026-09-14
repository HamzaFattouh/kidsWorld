"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.NotificationRepository = void 0;var _prisma = require("../core/prisma");


class NotificationRepository {
  async registerDeviceToken(userId, fcmToken, deviceType) {
    return _prisma.prisma.deviceToken.upsert({
      where: { fcmToken },
      update: { userId, deviceType, updatedAt: new Date() },
      create: { userId, fcmToken, deviceType }
    });
  }

  async removeDeviceToken(fcmToken) {
    return _prisma.prisma.deviceToken.deleteMany({ where: { fcmToken } });
  }

  async getDeviceTokensForUsers(userIds) {
    return _prisma.prisma.deviceToken.findMany({ where: { userId: { in: userIds } } });
  }

  async getPreferences(userId) {
    return _prisma.prisma.notificationPreference.findMany({ where: { userId } });
  }

  async upsertPreference(userId, type, isPushEnabled, isInAppEnabled) {
    return _prisma.prisma.notificationPreference.upsert({
      where: { userId_type: { userId, type } },
      update: { isPushEnabled, isInAppEnabled },
      create: { userId, type, isPushEnabled, isInAppEnabled }
    });
  }

  async createNotification(data) {
    return _prisma.prisma.notification.create({ data });
  }

  async getInbox(userId) {
    return _prisma.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(notificationId, userId) {
    return _prisma.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true }
    });
  }
}exports.NotificationRepository = NotificationRepository;