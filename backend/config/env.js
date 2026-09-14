"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.env = void 0;var _zod = require("zod");
var _dotenv = _interopRequireDefault(require("dotenv"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

_dotenv.default.config();

const envSchema = _zod.z.object({
  NODE_ENV: _zod.z.enum(['development', 'production', 'test']).default('development'),
  PORT: _zod.z.string().transform(Number).default(3000),
  DATABASE_URL: _zod.z.string()
  // Add other env vars here as needed (e.g., JWT_SECRET)
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format());
  process.exit(1);
}

const env = exports.env = _env.data;