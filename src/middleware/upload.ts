import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
const ALLOWED_MIMES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
];

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : '.mp4';
    cb(null, file.fieldname + '-' + uniqueSuffix + safeExt);
  },
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIMES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);
  if (mimeOk || extOk) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (e.g. MP4, WebM)'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter,
});
