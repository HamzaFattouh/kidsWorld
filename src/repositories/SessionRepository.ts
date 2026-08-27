import { prisma } from '../core/prisma';

export class SessionRepository {
  async createSession(userId: string, tokenHash: string, deviceInfo: string, expiresAt: Date): Promise<any> {
    return prisma.session.create({
      data: { userId, tokenHash, deviceInfo, expiresAt }
    });
  }

  async findValidSession(tokenHash: string): Promise<any | null> {
    return prisma.session.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() }
      }
    });
  }

  async revokeSession(tokenHash: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { tokenHash }
    });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId }
    });
  }
}
