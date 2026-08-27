import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../../../services/NotificationService';
import { auditService } from '../../../services/AuditService';

const notifService = new NotificationService();

export const registerDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    await notifService.registerDevice(user.userId, req.body.token, req.body.deviceType);
    res.json({ success: true });
  } catch (error) { next(error); }
};

export const removeDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notifService.removeDevice(req.params.token);
    res.json({ success: true });
  } catch (error) { next(error); }
};

export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { type, isPushEnabled, isInAppEnabled } = req.body;
    await notifService.updatePreferences(user.userId, type, isPushEnabled, isInAppEnabled);
    await auditService.log({
      action: 'SETTINGS_UPDATED',
      userId: user.userId,
      resource: 'PREFERENCE',
      metadata: { type, isPushEnabled, isInAppEnabled },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.json({ success: true });
  } catch (error) { next(error); }
};

export const getPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const prefs = await notifService.getPreferences(user.userId);
    res.json({ data: prefs });
  } catch (error) { next(error); }
};

export const getInbox = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const inbox = await notifService.getInbox(user.userId);
    res.json({ data: inbox });
  } catch (error) { next(error); }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    await notifService.markAsRead(req.params.id, user.userId);
    res.json({ success: true });
  } catch (error) { next(error); }
};
