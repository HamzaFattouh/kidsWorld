import { Request, Response, NextFunction } from 'express';
import { CmsService } from '../../../services/CmsService';

const cmsService = new CmsService();

export const createAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const record = await cmsService.createAnnouncement(req.body, user.userId);
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getAnnouncements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = (req as any).user?.role;
    const records = await cmsService.getAnnouncements(role);
    res.json({ data: records });
  } catch (error) { next(error); }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const payload = { ...req.body, authorId: user.userId };
    const record = await cmsService.createPost(payload, user.userId);
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = (req as any).user?.role;
    const records = await cmsService.getPosts(role);
    res.json({ data: records });
  } catch (error) { next(error); }
};

export const uploadGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    
    // In a real app, upload to S3 here. For now, store the local path.
    const url = `/uploads/${req.file.filename}`;
    const { captionEn, captionAr } = req.body;
    
    const record = await cmsService.uploadGalleryImage(url, captionEn, captionAr, user.userId);
    res.status(201).json({ data: record });
  } catch (error) { next(error); }
};
