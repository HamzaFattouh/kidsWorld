"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.sendMessageSchema = exports.createRequestSchema = exports.createComplaintSchema = void 0;var _zod = require("zod");

const createComplaintSchema = exports.createComplaintSchema = _zod.z.object({
  body: _zod.z.object({
    title: _zod.z.string().min(3),
    description: _zod.z.string().min(10),
    childId: _zod.z.string().uuid().optional()
  })
});

const createRequestSchema = exports.createRequestSchema = _zod.z.object({
  body: _zod.z.object({
    type: _zod.z.enum(['LEAVE', 'EARLY_PICKUP', 'PROFILE_UPDATE', 'DOCUMENT_REQUEST', 'MEETING_REQUEST']),
    description: _zod.z.string().min(5),
    childId: _zod.z.string().uuid().optional()
  })
});

const sendMessageSchema = exports.sendMessageSchema = _zod.z.object({
  body: _zod.z.object({
    receiverId: _zod.z.string().uuid(),
    content: _zod.z.string().min(1)
  })
});