import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRepository } from '../repositories/UserRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { TokenRepository } from '../repositories/TokenRepository';
import { auditService } from '../services/AuditService';
import { EmailService } from './EmailService';
import { UnauthorizedError, ValidationError } from '../core/errors/AppError';
// No TokenType

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

export class AuthService {
  constructor(
    private userRepo = new UserRepository(),
    private sessionRepo = new SessionRepository(),
    private tokenRepo = new TokenRepository(),
    private emailService = new EmailService()
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async login(email: string, passwordPlain: string, deviceInfo: string, ipAddress: string) {
    const user = await this.userRepo.findByEmail(email);
    
    if (!user) {
      await auditService.log({ action: 'LOGIN_FAILED', details: 'Invalid email', ipAddress, userAgent: deviceInfo });
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      await auditService.log({ action: 'LOGIN_FAILED', userId: user.id, details: 'Account disabled', ipAddress, userAgent: deviceInfo });
      throw new UnauthorizedError('Account is disabled');
    }

    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isValid) {
      await auditService.log({ action: 'LOGIN_FAILED', userId: user.id, details: 'Invalid password', ipAddress, userAgent: deviceInfo });
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new UnauthorizedError('Email not verified');
    }

    if (user.requiresPasswordChange) {
      // Allow them to login but flag that they must change password immediately
      // The frontend should intercept this specific code
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const tokenHash = this.hashToken(token);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepo.createSession(user.id, tokenHash, deviceInfo, expiresAt);
    await auditService.log({ action: 'LOGIN_SUCCESS', userId: user.id, ipAddress, userAgent: deviceInfo });

    return { token, user: { id: user.id, email: user.email, role: user.role, requiresPasswordChange: user.requiresPasswordChange } };
  }

  async logout(token: string, userId?: string, ipAddress?: string, userAgent?: string) {
    const tokenHash = this.hashToken(token);
    await this.sessionRepo.revokeSession(tokenHash);
    
    if (userId) {
      await auditService.log({ action: 'LOGOUT', userId, ipAddress, userAgent });
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return; // Do not leak user existence

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(resetToken);
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await this.tokenRepo.createToken(user.id, 'RESET' as any, tokenHash, expiresAt);
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    
    await auditService.log({ action: 'PASSWORD_RESET_REQUESTED', userId: user.id });
  }

  async resetPassword(resetToken: string, newPasswordPlain: string) {
    const tokenHash = this.hashToken(resetToken);
    const tokenRecord = await this.tokenRepo.findValidToken(tokenHash, 'RESET' as any);

    if (!tokenRecord) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPasswordPlain, 10);
    await this.userRepo.update(tokenRecord.userId, { passwordHash, requiresPasswordChange: false });
    
    // Revoke all existing sessions so they have to login with new password
    await this.sessionRepo.revokeAllUserSessions(tokenRecord.userId);
    await this.tokenRepo.deleteToken(tokenRecord.id);
    
    await auditService.log({ action: 'PASSWORD_RESET_COMPLETED', userId: tokenRecord.userId });
  }

  async verifyEmail(verificationToken: string) {
    const tokenHash = this.hashToken(verificationToken);
    const tokenRecord = await this.tokenRepo.findValidToken(tokenHash, 'VERIFICATION' as any);

    if (!tokenRecord) {
      throw new ValidationError('Invalid or expired verification token');
    }

    await this.userRepo.update(tokenRecord.userId, { isVerified: true });
    await this.tokenRepo.deleteToken(tokenRecord.id);
  }

  async forcePasswordChange(userId: string, newPasswordPlain: string) {
    const passwordHash = await bcrypt.hash(newPasswordPlain, 10);
    await this.userRepo.update(userId, { passwordHash, requiresPasswordChange: false });
    
    await auditService.log({ action: 'PASSWORD_CHANGED_FORCED', userId });
  }
}
