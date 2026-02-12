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

// Uploads directory handling (Use /tmp in Vercel/Serverless)
const uploadsDir = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'uploads')
  : path.join(process.cwd(), 'uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  console.warn('Warning: Could not create uploads directory. File uploads may fail.', error);
}

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
}));
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

// Vercel requires exporting the app
export default app;

// Only listen if run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
