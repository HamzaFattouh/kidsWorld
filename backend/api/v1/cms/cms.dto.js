"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.updateHomepageConfigSchema = exports.createEventSchema = exports.createPostSchema = exports.createAnnouncementSchema = void 0;var _zod = require("zod");

const createAnnouncementSchema = exports.createAnnouncementSchema = _zod.z.object({
  body: _zod.z.object({
    titleEn: _zod.z.string().min(3),
    titleAr: _zod.z.string().min(3),
    contentEn: _zod.z.string().min(5),
    contentAr: _zod.z.string().min(5),
    priority: _zod.z.enum(['NORMAL', 'HIGH', 'URGENT']).optional(),
    isPublished: _zod.z.boolean().optional()
  })
});

const createPostSchema = exports.createPostSchema = _zod.z.object({
  body: _zod.z.object({
    categoryId: _zod.z.string().uuid(),
    titleEn: _zod.z.string().min(3),
    titleAr: _zod.z.string().min(3),
    contentEn: _zod.z.string().min(10),
    contentAr: _zod.z.string().min(10),
    isPublished: _zod.z.boolean().optional()
  })
});

const createEventSchema = exports.createEventSchema = _zod.z.object({
  body: _zod.z.object({
    titleEn: _zod.z.string().min(3),
    titleAr: _zod.z.string().min(3),
    descriptionEn: _zod.z.string().min(5),
    descriptionAr: _zod.z.string().min(5),
    eventDate: _zod.z.string(),
    isPublished: _zod.z.boolean().optional().or(_zod.z.string().transform(v => v === 'true'))
  })
});

const updateHomepageConfigSchema = exports.updateHomepageConfigSchema = _zod.z.object({
  body: _zod.z.object({
    section: _zod.z.string(),
    titleEn: _zod.z.string().optional(),
    titleAr: _zod.z.string().optional(),
    bodyEn: _zod.z.string().optional(),
    bodyAr: _zod.z.string().optional(),
    isVisible: _zod.z.boolean().optional(),
    orderIndex: _zod.z.number().optional()
  })
});