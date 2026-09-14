"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.CommunicationService = void 0;var _CommunicationRepository = require("../repositories/CommunicationRepository");

var _prisma = require("../core/prisma");
var _AppError = require("../core/errors/AppError");

class CommunicationService {
  constructor(commRepo = new _CommunicationRepository.CommunicationRepository()) {this.commRepo = commRepo;}

  async createComplaint(data) {
    return this.commRepo.createComplaint(data);
  }

  async getComplaints(role, userId) {
    const parentId = role === 'PARENT' ? userId : undefined;
    return this.commRepo.getComplaints(parentId);
  }

  async createRequest(data) {
    return this.commRepo.createRequest(data);
  }

  async getRequests(role, userId) {
    const parentId = role === 'PARENT' ? userId : undefined;
    return this.commRepo.getRequests(parentId);
  }

  async sendMessage(senderId, senderRole, receiverId, content) {
    // Basic messaging boundary checks
    // Parent can only message Teacher if Teacher teaches their child
    if (senderRole === 'PARENT') {
      const receiver = await _prisma.prisma.user.findUnique({ where: { id: receiverId } });
      if (receiver?.role === 'TEACHER') {
        const hasLink = await _prisma.prisma.child.findFirst({
          where: {
            parentId: senderId,
            class: { teachers: { some: { teacherId: receiverId } } }
          }
        });
        if (!hasLink) throw new _AppError.ForbiddenError('You can only message teachers assigned to your child.');
      }
    }

    return this.commRepo.sendMessage({ senderId, receiverId, content });
  }

  async getThread(userId, targetUserId) {
    return this.commRepo.getMessagesBetweenUsers(userId, targetUserId);
  }

  async readThread(senderId, receiverId) {
    return this.commRepo.markMessagesAsRead(senderId, receiverId);
  }
}exports.CommunicationService = CommunicationService;