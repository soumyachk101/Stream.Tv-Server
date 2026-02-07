import { Router } from 'express';
import { upload } from '../middleware/upload';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadVideo, getVideos, getVideoById } from '../controllers/videoController';

const router = Router();

router.post('/upload', authenticateToken, upload.single('video'), uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);

export default router;
