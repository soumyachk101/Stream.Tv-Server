"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
const ALLOWED_MIMES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
];
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : '.mp4';
        cb(null, file.fieldname + '-' + uniqueSuffix + safeExt);
    },
});
const fileFilter = (req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const mimeOk = ALLOWED_MIMES.includes(file.mimetype);
    const extOk = ALLOWED_EXTENSIONS.includes(ext);
    if (mimeOk || extOk) {
        cb(null, true);
    }
    else {
        cb(new Error('Only video files are allowed (e.g. MP4, WebM)'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter,
});
