import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Allowed section names corresponding to dynamic images
const ALLOWED_SECTIONS = [
  'hero',
  'welcome',
  'programs',
  'value_1',
  'value_2',
  'value_3',
  'class_1',
  'class_2',
  'class_3'
];

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../../web/public/images/dynamic');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // The section will be sent in the request body
    const section = req.body.section;
    if (!ALLOWED_SECTIONS.includes(section)) {
      return cb(new Error('Invalid section name: ' + section), '');
    }
    // Overwrite the existing file by keeping the exact name
    cb(null, `${section}.jpg`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image'); // Expecting 'image' field in form-data

export const uploadImage = (req: Request, res: Response): void => {
  upload(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }
    
    return res.status(200).json({
      message: 'Image uploaded successfully',
      filename: req.file.filename,
      path: `/images/dynamic/${req.file.filename}`
    });
  });
};
