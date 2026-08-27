import { Request, Response, NextFunction } from 'express';
import { CommunicationService } from '../../../services/CommunicationService';
import { auditService } from '../../../services/AuditService';

const commService = new CommunicationService();

export const createComplaint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const payload = { ...req.body, parentId: user.userId };
    const record = await commService.createComplaint(payload);
    await auditService.log({
      action: 'COMPLAINT_CREATED',
      userId: user.userId,
      resource: 'COMPLAINT',
      resourceId: record.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getComplaints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const records = await commService.getComplaints(user.role, user.userId);
    res.json({ data: records });
  } catch (error) { next(error); }
};

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const payload = { ...req.body, parentId: user.userId };
    const record = await commService.createRequest(payload);
    await auditService.log({
      action: 'REQUEST_CREATED',
      userId: user.userId,
      resource: 'PARENT_REQUEST',
      resourceId: record.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const records = await commService.getRequests(user.role, user.userId);
    res.json({ data: records });
  } catch (error) { next(error); }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { receiverId, content } = req.body;
    const record = await commService.sendMessage(user.userId, user.role, receiverId, content);
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const targetUserId = req.params.otherUserId;
    const records = await commService.getThread(user.userId, targetUserId);
    res.json({ data: records });
  } catch (error) { next(error); }
};
