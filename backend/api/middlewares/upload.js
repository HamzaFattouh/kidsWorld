"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.upload = void 0;var _multer = _interopRequireDefault(require("multer"));
var _path = _interopRequireDefault(require("path"));
var _AppError = require("../../core/errors/AppError");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

// Ensure uploads folder exists in a real app or use memory storage for cloud upload
const storage = _multer.default.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Requires an uploads/ folder at root
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + _path.default.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new _AppError.BadRequestError('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
  }
};

const upload = exports.upload = (0, _multer.default)({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});