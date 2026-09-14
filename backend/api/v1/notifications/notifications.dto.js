"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.updatePreferenceSchema = exports.registerDeviceSchema = void 0;var _zod = require("zod");

const registerDeviceSchema = exports.registerDeviceSchema = _zod.z.object({
  body: _zod.z.object({
    token: _zod.z.string().min(10),
    deviceType: _zod.z.enum(['IOS', 'ANDROID', 'WEB'])
  })
});

const updatePreferenceSchema = exports.updatePreferenceSchema = _zod.z.object({
  body: _zod.z.object({
    type: _zod.z.string().min(2),
    isPushEnabled: _zod.z.boolean(),
    isInAppEnabled: _zod.z.boolean()
  })
});