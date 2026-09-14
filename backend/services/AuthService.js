"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.AuthService = void 0;var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _crypto = _interopRequireDefault(require("crypto"));
var _UserRepository = require("../repositories/UserRepository");
var _SessionRepository = require("../repositories/SessionRepository");
var _TokenRepository = require("../repositories/TokenRepository");
var _AuditService = require("../services/AuditService");
var _EmailService = require("./EmailService");
var _AppError = require("../core/errors/AppError");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
// No TokenType

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

class AuthService {
  constructor(
  userRepo = new _UserRepository.UserRepository(),
  sessionRepo = new _SessionRepository.SessionRepository(),
  tokenRepo = new _TokenRepository.TokenRepository(),
  emailService = new _EmailService.EmailService())
  {this.userRepo = userRepo;this.sessionRepo = sessionRepo;this.tokenRepo = tokenRepo;this.emailService = emailService;}

  hashToken(token) {
    return _crypto.default.createHash('sha256').update(token).digest('hex');
  }

  async login(identifier, passwordPlain, deviceInfo, ipAddress) {
    const user = await this.userRepo.findByEmailOrName(identifier);

    if (!user) {
      await _AuditService.auditService.log({ action: 'LOGIN_FAILED', details: 'Invalid user', ipAddress, userAgent: deviceInfo });
      throw new _AppError.UnauthorizedError('Invalid email/name or password');
    }

    if (!user.isActive) {
      await _AuditService.auditService.log({ action: 'LOGIN_FAILED', userId: user.id, details: 'Account disabled', ipAddress, userAgent: deviceInfo });
      throw new _AppError.UnauthorizedError('Account is disabled');
    }

    const isValid = await _bcrypt.default.compare(passwordPlain, user.passwordHash);
    if (!isValid) {
      await _AuditService.auditService.log({ action: 'LOGIN_FAILED', userId: user.id, details: 'Invalid password', ipAddress, userAgent: deviceInfo });
      throw new _AppError.UnauthorizedError('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new _AppError.UnauthorizedError('Email not verified');
    }

    if (user.requiresPasswordChange) {




      // Allow them to login but flag that they must change password immediately
      // The frontend should intercept this specific code
    }const token = _jsonwebtoken.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepo.createSession(user.id, tokenHash, deviceInfo, expiresAt);
    await _AuditService.auditService.log({ action: 'LOGIN_SUCCESS', userId: user.id, ipAddress, userAgent: deviceInfo });

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, requiresPasswordChange: user.requiresPasswordChange } };
  }

  async logout(token, userId, ipAddress, userAgent) {
    const tokenHash = this.hashToken(token);
    await this.sessionRepo.revokeSession(tokenHash);

    if (userId) {
      await _AuditService.auditService.log({ action: 'LOGOUT', userId, ipAddress, userAgent });
    }
  }

  async forgotPassword(email) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return; // Do not leak user existence

    const resetToken = _crypto.default.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(resetToken);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await this.tokenRepo.createToken(user.id, 'RESET', tokenHash, expiresAt);
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    await _AuditService.auditService.log({ action: 'PASSWORD_RESET_REQUESTED', userId: user.id });
  }

  async resetPassword(resetToken, newPasswordPlain) {
    const tokenHash = this.hashToken(resetToken);
    const tokenRecord = await this.tokenRepo.findValidToken(tokenHash, 'RESET');

    if (!tokenRecord) {
      throw new _AppError.ValidationError('Invalid or expired reset token');
    }

    const passwordHash = await _bcrypt.default.hash(newPasswordPlain, 10);
    await this.userRepo.update(tokenRecord.userId, { passwordHash, requiresPasswordChange: false });

    // Revoke all existing sessions so they have to login with new password
    await this.sessionRepo.revokeAllUserSessions(tokenRecord.userId);
    await this.tokenRepo.deleteToken(tokenRecord.id);

    await _AuditService.auditService.log({ action: 'PASSWORD_RESET_COMPLETED', userId: tokenRecord.userId });
  }

  async verifyEmail(verificationToken) {
    const tokenHash = this.hashToken(verificationToken);
    const tokenRecord = await this.tokenRepo.findValidToken(tokenHash, 'VERIFICATION');

    if (!tokenRecord) {
      throw new _AppError.ValidationError('Invalid or expired verification token');
    }

    await this.userRepo.update(tokenRecord.userId, { isVerified: true });
    await this.tokenRepo.deleteToken(tokenRecord.id);
  }

  async forcePasswordChange(userId, newPasswordPlain) {
    const passwordHash = await _bcrypt.default.hash(newPasswordPlain, 10);
    await this.userRepo.update(userId, { passwordHash, requiresPasswordChange: false });

    await _AuditService.auditService.log({ action: 'PASSWORD_CHANGED_FORCED', userId });
  }
}exports.AuthService = AuthService;