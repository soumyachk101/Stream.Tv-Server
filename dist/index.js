"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
    console.error('Fatal: JWT_SECRET must be set and at least 16 characters.');
    process.exit(1);
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Uploads directory (project root when run from server/, or cwd)
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use('/uploads', express_1.default.static(uploadsDir));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/videos', videoRoutes_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Video Streaming API' });
});
// Handle multer file filter and other errors
app.use((err, _req, res, _next) => {
    console.error('Request error:', err);
    const message = err instanceof Error ? err.message : 'Something went wrong';
    const status = message.includes('Only video') ? 400 : 500;
    res.status(status).json({ message });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
