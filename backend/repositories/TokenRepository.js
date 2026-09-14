"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.TokenRepository = void 0;var _prisma = require("../core/prisma");


class TokenRepository {
  async createToken(userId, type, tokenHash, expiresAt) {
    return _prisma.prisma.token.create({
      data: { userId, type, tokenHash, expiresAt }
    });
  }

  async findValidToken(tokenHash, type) {
    return _prisma.prisma.token.findFirst({
      where: {
        tokenHash,
        type,
        expiresAt: { gt: new Date() }
      }
    });
  }

  async deleteToken(id) {
    await _prisma.prisma.token.delete({ where: { id } });
  }
}exports.TokenRepository = TokenRepository;