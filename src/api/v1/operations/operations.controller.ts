import { Request, Response, NextFunction } from 'express';
import { OperationsService } from '../../../services/OperationsService';

const opsService = new OperationsService();

export const logAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await opsService.logAttendance(req.body);
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as any;
    const records = await opsService.getAttendance(req.params.childId, startDate, endDate);
    res.json({ data: records });
  } catch (error) { next(error); }
};

export const logMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await opsService.logMeal(req.body);
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getMeals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.query as any;
    const records = await opsService.getMeals(req.params.childId, date);
    res.json({ data: records });
  } catch (error) { next(error); }
};

export const logActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await opsService.logActivity(req.body);
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.query as any;
    const records = await opsService.getActivities(req.params.childId, date);
    res.json({ data: records });
  } catch (error) { next(error); }
};
