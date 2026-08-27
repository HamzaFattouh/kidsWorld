import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UnauthorizedError } from '../../core/errors/AppError';
import { SessionRepository } from '../../repositories/SessionRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';
const sessionRepo = new SessionRepository();

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const payload = jwt.verify(token, JWT_SECRET) as any;

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const session = await sessionRepo.findValidSession(tokenHash);

    if (!session) {
      throw new UnauthorizedError('Session expired or revoked');
    }

    (req as any).user = payload;
    next();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
