import { CommunicationRepository } from '../repositories/CommunicationRepository';
import { Prisma } from '@prisma/client';
import { prisma } from '../core/prisma';
import { ForbiddenError } from '../core/errors/AppError';

export class CommunicationService {
  constructor(private commRepo = new CommunicationRepository()) {}

  async createComplaint(data: Prisma.ComplaintUncheckedCreateInput) {
    return this.commRepo.createComplaint(data);
  }

  async getComplaints(role: string, userId: string) {
    const parentId = role === 'PARENT' ? userId : undefined;
    return this.commRepo.getComplaints(parentId);
  }

  async createRequest(data: Prisma.ParentRequestUncheckedCreateInput) {
    return this.commRepo.createRequest(data);
  }

  async getRequests(role: string, userId: string) {
    const parentId = role === 'PARENT' ? userId : undefined;
    return this.commRepo.getRequests(parentId);
  }

  async sendMessage(senderId: string, senderRole: string, receiverId: string, content: string) {
    // Basic messaging boundary checks
    // Parent can only message Teacher if Teacher teaches their child
    if (senderRole === 'PARENT') {
      const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
      if (receiver?.role === 'TEACHER') {
        const hasLink = await prisma.child.findFirst({
          where: {
            parentId: senderId,
            class: { teachers: { some: { teacherId: receiverId } } }
          }
        });
        if (!hasLink) throw new ForbiddenError('You can only message teachers assigned to your child.');
      }
    }
    
    return this.commRepo.sendMessage({ senderId, receiverId, content });
  }

  async getThread(userId: string, targetUserId: string) {
    return this.commRepo.getMessagesBetweenUsers(userId, targetUserId);
  }

  async readThread(senderId: string, receiverId: string) {
    return this.commRepo.markMessagesAsRead(senderId, receiverId);
  }
}
