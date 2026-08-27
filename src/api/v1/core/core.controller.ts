import { Request, Response, NextFunction } from 'express';
import { ChildService } from '../../../services/ChildService';
import { ClassService } from '../../../services/ClassService';
import { auditService } from '../../../services/AuditService';

const childService = new ChildService();
const classService = new ClassService();

export const createChild = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const child = await childService.createChild(req.body);
    const user = (req as any).user;
    await auditService.log({
      action: 'CHILD_CREATED',
      userId: user?.userId || user?.id,
      resource: 'CHILD',
      resourceId: child.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ data: child });
  } catch (error) { next(error); }
};

export const listChildren = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, classId, parentId } = req.query as any;
    const skip = (page - 1) * limit;
    
    // For Parent and Teacher roles, limit queries to their authorized resources automatically
    const user = (req as any).user;
    let finalParentId = parentId;
    if (user.role === 'PARENT') finalParentId = user.userId;

    const children = await childService.listChildren(skip, limit, classId, finalParentId);
    res.json({ data: children, meta: { page, limit } });
  } catch (error) { next(error); }
};

export const getChild = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const child = await childService.getChildById(req.params.id);
    const user = (req as any).user;
    await auditService.log({
      action: 'CHILD_ACCESSED',
      userId: user?.userId || user?.id,
      resource: 'CHILD',
      resourceId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.json({ data: child });
  } catch (error) { next(error); }
};

export const createClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cls = await classService.createClass(req.body);
    res.status(201).json({ data: cls });
  } catch (error) { next(error); }
};

export const listClasses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query as any;
    const skip = (page - 1) * limit;
    const classes = await classService.listClasses(skip, limit);
    res.json({ data: classes, meta: { page, limit } });
  } catch (error) { next(error); }
};
