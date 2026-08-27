import { Request, Response, NextFunction } from 'express';
import { ReportingService } from '../../../services/ReportingService';
import { auditService } from '../../../services/AuditService';

const reportingService = new ReportingService();

export const createIncident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await reportingService.createIncident(req.body);
    const user = (req as any).user;
    await auditService.log({
      action: 'INCIDENT_CREATED',
      userId: user?.userId || user?.id,
      resource: 'CHILD',
      resourceId: req.body.childId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getIncidents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const records = await reportingService.getIncidents(req.params.childId, user.role);
    res.json({ data: records });
  } catch (error) { next(error); }
};

export const createWeeklyNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await reportingService.createWeeklyNote(req.body);
    const user = (req as any).user;
    await auditService.log({
      action: 'WEEKLY_NOTE_CREATED',
      userId: user?.userId || user?.id,
      resource: 'CHILD',
      resourceId: req.body.childId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getWeeklyNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await reportingService.getWeeklyNotes(req.params.childId);
    res.json({ data: records });
  } catch (error) { next(error); }
};

export const createEvaluation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await reportingService.createEvaluation(req.body);
    const user = (req as any).user;
    await auditService.log({
      action: 'EVALUATION_CREATED',
      userId: user?.userId || user?.id,
      resource: 'CHILD',
      resourceId: req.body.childId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getEvaluations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await reportingService.getEvaluations(req.params.childId);
    res.json({ data: records });
  } catch (error) { next(error); }
};
