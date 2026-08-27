import { Request, Response } from 'express';

export const getHealthStatus = (req: Request, res: Response) => {
  res.status(200).json({
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
    },
    meta: {}
  });
};
