"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.SessionRepository = void 0;var _prisma = require("../core/prisma");

class SessionRepository {
  async createSession(userId, tokenHash, deviceInfo, expiresAt) {
    return _prisma.prisma.session.create({
      data: { userId, tokenHash, deviceInfo, expiresAt }
    });
  }

  async findValidSession(tokenHash) {
    return _prisma.prisma.session.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() }
      }
    });
  }

  async revokeSession(tokenHash) {
    await _prisma.prisma.session.deleteMany({
      where: { tokenHash }
    });
  }

  async revokeAllUserSessions(userId) {
    await _prisma.prisma.session.deleteMany({
      where: { userId }
    });
  }
}exports.SessionRepository = SessionRepository;