"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.auditService = exports.AuditService = void 0;var _prisma = require("../core/prisma");












class AuditService {

  /**
   * Recursively scrubs sensitive data from metadata objects
   */
  scrubData(data) {
    if (!data) return data;

    // If it's an array, scrub each element
    if (Array.isArray(data)) {
      return data.map((item) => this.scrubData(item));
    }

    // If it's an object, scrub sensitive keys
    if (typeof data === 'object' && data !== null) {
      const scrubbed = { ...data };
      const sensitiveKeys = ['password', 'passwordHash', 'token', 'secret', 'fcmToken', 'refreshToken', 'accessToken', 'authorization'];

      for (const key of Object.keys(scrubbed)) {
        if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
          scrubbed[key] = '[REDACTED]';
        } else if (typeof scrubbed[key] === 'object') {
          scrubbed[key] = this.scrubData(scrubbed[key]);
        }
      }
      return scrubbed;
    }

    return data;
  }

  async log(options) {
    const { action, userId, resource, resourceId, details, metadata, ipAddress, userAgent } = options;

    const safeMetadata = this.scrubData(metadata);

    await _prisma.prisma.auditLog.create({
      data: {
        action,
        userId,
        resource,
        resourceId,
        details,
        metadata: safeMetadata,
        ipAddress,
        userAgent
      }
    });
  }
}exports.AuditService = AuditService;

const auditService = exports.auditService = new AuditService();