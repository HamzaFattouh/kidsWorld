import { prisma } from '../core/prisma';

export interface AuditLogOptions {
  action: string;
  userId?: string;
  resource?: string;
  resourceId?: string;
  details?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  
  /**
   * Recursively scrubs sensitive data from metadata objects
   */
  private scrubData(data: any): any {
    if (!data) return data;
    
    // If it's an array, scrub each element
    if (Array.isArray(data)) {
      return data.map(item => this.scrubData(item));
    }
    
    // If it's an object, scrub sensitive keys
    if (typeof data === 'object' && data !== null) {
      const scrubbed = { ...data };
      const sensitiveKeys = ['password', 'passwordHash', 'token', 'secret', 'fcmToken', 'refreshToken', 'accessToken', 'authorization'];
      
      for (const key of Object.keys(scrubbed)) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          scrubbed[key] = '[REDACTED]';
        } else if (typeof scrubbed[key] === 'object') {
          scrubbed[key] = this.scrubData(scrubbed[key]);
        }
      }
      return scrubbed;
    }
    
    return data;
  }

  async log(options: AuditLogOptions): Promise<void> {
    const { action, userId, resource, resourceId, details, metadata, ipAddress, userAgent } = options;
    
    const safeMetadata = this.scrubData(metadata);
    
    await prisma.auditLog.create({
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
}

export const auditService = new AuditService();
