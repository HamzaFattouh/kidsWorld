import { prisma } from '../core/prisma';
import { Prisma } from '@prisma/client';

export class NotificationRepository {
  async registerDeviceToken(userId: string, fcmToken: string, deviceType: string) {
    return prisma.deviceToken.upsert({
      where: { fcmToken },
      update: { userId, deviceType, updatedAt: new Date() },
      create: { userId, fcmToken, deviceType }
    });
  }

  async removeDeviceToken(fcmToken: string) {
    return prisma.deviceToken.deleteMany({ where: { fcmToken } });
  }

  async getDeviceTokensForUsers(userIds: string[]) {
    return prisma.deviceToken.findMany({ where: { userId: { in: userIds } } });
  }

  async getPreferences(userId: string) {
    return prisma.notificationPreference.findMany({ where: { userId } });
  }

  async upsertPreference(userId: string, type: string, isPushEnabled: boolean, isInAppEnabled: boolean) {
    return prisma.notificationPreference.upsert({
      where: { userId_type: { userId, type } },
      update: { isPushEnabled, isInAppEnabled },
      create: { userId, type, isPushEnabled, isInAppEnabled }
    });
  }

  async createNotification(data: Prisma.NotificationUncheckedCreateInput) {
    return prisma.notification.create({ data });
  }

  async getInbox(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true }
    });
  }
}
