"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.logger = void 0;var _pino = _interopRequireDefault(require("pino"));
var _env = require("./env");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const isDev = _env.env.NODE_ENV !== 'production';

const logger = exports.logger = (0, _pino.default)({
  level: isDev ? 'debug' : 'info',
  transport: isDev ?
  {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  } :
  undefined
});