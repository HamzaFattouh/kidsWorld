"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.uploadImage = void 0;
var _multer = _interopRequireDefault(require("multer"));
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

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
'class_3'];


// Configure multer storage
const storage = _multer.default.diskStorage({
  destination: (req, file, cb) => {
    const dir = _path.default.join(__dirname, '../../../web/public/images/dynamic');
    if (!_fs.default.existsSync(dir)) {
      _fs.default.mkdirSync(dir, { recursive: true });
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

const upload = (0, _multer.default)({
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

const uploadImage = (req, res) => {
  upload(req, res, (err) => {
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
};exports.uploadImage = uploadImage;