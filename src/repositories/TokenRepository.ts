import { prisma } from '../core/prisma';
import { Token, TokenType } from '@prisma/client';

export class TokenRepository {
  async createToken(userId: string, type: TokenType, tokenHash: string, expiresAt: Date): Promise<Token> {
    return prisma.token.create({
      data: { userId, type, tokenHash, expiresAt }
    });
  }

  async findValidToken(tokenHash: string, type: TokenType): Promise<Token | null> {
    return prisma.token.findFirst({
      where: {
        tokenHash,
        type,
        expiresAt: { gt: new Date() }
      }
    });
  }

  async deleteToken(id: string): Promise<void> {
    await prisma.token.delete({ where: { id } });
  }
}
