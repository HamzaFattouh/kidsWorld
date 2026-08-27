import { prisma } from '../core/prisma';
import { Prisma } from '@prisma/client';

export class CommunicationRepository {
  async createComplaint(data: Prisma.ComplaintUncheckedCreateInput) {
    return prisma.complaint.create({ data });
  }

  async getComplaints(parentId?: string) {
    const where = parentId ? { parentId } : {};
    return prisma.complaint.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async createRequest(data: Prisma.ParentRequestUncheckedCreateInput) {
    return prisma.parentRequest.create({ data });
  }

  async getRequests(parentId?: string) {
    const where = parentId ? { parentId } : {};
    return prisma.parentRequest.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async sendMessage(data: Prisma.MessageUncheckedCreateInput) {
    return prisma.message.create({ data });
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string) {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async markMessagesAsRead(senderId: string, receiverId: string) {
    return prisma.message.updateMany({
      where: {
        senderId,
        receiverId,
        isRead: false
      },
      data: { isRead: true }
    });
  }
}
