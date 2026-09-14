"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.CommunicationRepository = void 0;var _prisma = require("../core/prisma");


class CommunicationRepository {
  async createComplaint(data) {
    return _prisma.prisma.complaint.create({ data });
  }

  async getComplaints(parentId) {
    const where = parentId ? { parentId } : {};
    return _prisma.prisma.complaint.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async createRequest(data) {
    return _prisma.prisma.parentRequest.create({ data });
  }

  async getRequests(parentId) {
    const where = parentId ? { parentId } : {};
    return _prisma.prisma.parentRequest.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async sendMessage(data) {
    return _prisma.prisma.message.create({ data });
  }

  async getMessagesBetweenUsers(user1Id, user2Id) {
    return _prisma.prisma.message.findMany({
      where: {
        OR: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }]

      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async markMessagesAsRead(senderId, receiverId) {
    return _prisma.prisma.message.updateMany({
      where: {
        senderId,
        receiverId,
        isRead: false
      },
      data: { isRead: true }
    });
  }
}exports.CommunicationRepository = CommunicationRepository;