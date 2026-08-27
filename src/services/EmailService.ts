import { logger } from '../config/logger';

export class EmailService {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    logger.info({ email, token }, 'MOCK EMAIL: Verify your account');
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    logger.info({ email, token }, 'MOCK EMAIL: Reset your password');
  }
}
