import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/authRoutes';
import videoRoutes from './routes/videoRoutes';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('Fatal: JWT_SECRET must be set and at least 16 characters.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Uploads directory (project root when run from server/, or cwd)
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Video Streaming API' });
});

// Handle multer file filter and other errors
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Request error:', err);
  const message = err instanceof Error ? err.message : 'Something went wrong';
  const status = message.includes('Only video') ? 400 : 500;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
