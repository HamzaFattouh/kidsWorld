"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _camera = require("./routes/camera.routes");
var _errorHandler = require("./api/middlewares/errorHandler");
var _rateLimiter = require("./api/middlewares/rateLimiter");
var _csrfDefender = require("./api/middlewares/csrfDefender");
var _routes = _interopRequireDefault(require("./api/v1/routes"));
var _cms = require("./routes/cms.routes");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const app = (0, _express.default)();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use((0, _cors.default)({
  origin: (origin, callback) => {
    return callback(null, true);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-app-client', 'Accept']
}));

// Body Parsing
app.use(_express.default.json());
app.use(_express.default.urlencoded({ extended: true }));
app.use((0, _cookieParser.default)());

// Rate Limiting
app.use('/api', _rateLimiter.apiLimiter);

// API Routes
app.use('/api', _csrfDefender.requireAppHeader);
app.use('/api/v1', _routes.default);
app.use('/api/v1/cameras', _camera.cameraRoutes);
app.use('/api/v1/cms', _cms.cmsRoutes);

// Centralized Error Handling
app.use(_errorHandler.errorHandler);var _default = exports.default =

app;