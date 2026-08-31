import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../core/prisma';

export const listResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resource = req.params.resource; // e.g. "child", "class"
    
    // Safety check to ensure it's a valid prisma model
    if (!(resource in prisma) || typeof (prisma as any)[resource].findMany !== 'function') {
      return res.status(404).json({ error: { message: 'Resource not found' } });
    }

    // Build where clause from query params
    const where: any = {};
    for (const key in req.query) {
      if (key !== 'page' && key !== 'limit' && typeof req.query[key] === 'string') {
        where[key] = req.query[key];
      }
    }

    const data = await (prisma as any)[resource].findMany({
      where,
      orderBy: { id: 'desc' },
      take: 50,
    });
    
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const createResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resource = req.params.resource;
    
    if (!(resource in prisma) || typeof (prisma as any)[resource].create !== 'function') {
      return res.status(404).json({ error: { message: 'Resource not found' } });
    }

    const data = await (prisma as any)[resource].create({
      data: req.body,
    });
    
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};
