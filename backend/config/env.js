
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.env = void 0;var _zod = require("zod");
var _dotenv = _interopRequireDefault(require("dotenv"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

_dotenv.default.config();

const envSchema = _zod.z.object({
  NODE_ENV: _zod.z.enum(['development', 'production', 'test']).default('development'),
  PORT: _zod.z.union([_zod.z.string().transform(Number), _zod.z.number()]).default(3000),
  DATABASE_URL: _zod.z.string().optional()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.warn('Invalid environment variables warning:', _env.error.format());
}

const env = exports.env = _env.success ? _env.data : {
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || 10000,
  DATABASE_URL: process.env.DATABASE_URL
};