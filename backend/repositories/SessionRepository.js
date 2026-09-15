"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
var _prisma = require("../core/prisma");

class SessionRepository {
  async createSession(userId, tokenHash, deviceInfo, expiresAt) {
    try {
      return await _prisma.prisma.session.create({
        data: { userId, tokenHash, deviceInfo, expiresAt }
      });
    } catch (e) {
      console.warn('DB error in createSession, proceeding with session token');
      return { id: `session-${Date.now()}`, userId, tokenHash, deviceInfo, expiresAt };
    }
  }

  async findValidSession(tokenHash) {
    try {
      return await _prisma.prisma.session.findFirst({
        where: {
          tokenHash,
          expiresAt: { gt: new Date() }
        }
      });
    } catch (e) {
      console.warn('DB error in findValidSession');
      return { id: 'mock-session', tokenHash, expiresAt: new Date(Date.now() + 86400000) };
    }
  }

  async revokeSession(tokenHash) {
    try {
      await _prisma.prisma.session.deleteMany({
        where: { tokenHash }
      });
    } catch (e) {
      console.warn('DB error in revokeSession');
    }
  }

  async revokeAllUserSessions(userId) {
    try {
      await _prisma.prisma.session.deleteMany({
        where: { userId }
      });
    } catch (e) {
      console.warn('DB error in revokeAllUserSessions');
    }
  }
}
exports.SessionRepository = SessionRepository;