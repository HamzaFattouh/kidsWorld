"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.EmailService = void 0;var _logger = require("../config/logger");

class EmailService {
  async sendVerificationEmail(email, token) {
    _logger.logger.info({ email, token }, 'MOCK EMAIL: Verify your account');
  }

  async sendPasswordResetEmail(email, token) {
    _logger.logger.info({ email, token }, 'MOCK EMAIL: Reset your password');
  }
}exports.EmailService = EmailService;