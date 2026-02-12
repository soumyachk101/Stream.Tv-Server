"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoById = exports.getVideos = exports.uploadVideo = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
function validateVideoBody(body) {
    if (!body || typeof body !== 'object') {
        return { error: 'Invalid request body' };
    }
    const { title, description } = body;
    if (typeof title !== 'string' || !title.trim()) {
        return { error: 'Title is required' };
    }
    if (title.length > MAX_TITLE_LENGTH) {
        return { error: `Title must be at most ${MAX_TITLE_LENGTH} characters` };
    }
    const desc = description == null ? '' : typeof description === 'string' ? description : String(description);
    if (desc.length > MAX_DESCRIPTION_LENGTH) {
        return { error: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters` };
    }
    return { title: title.trim(), description: desc.trim() };
}
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No video file uploaded' });
            return;
        }
        const validated = validateVideoBody(req.body);
        if ('error' in validated) {
            res.status(400).json({ message: validated.error });
            return;
        }
        const { title, description } = validated;
        const userId = req.user.userId;
        const videoUrl = `/uploads/${req.file.filename}`;
        const thumbnailUrl = 'https://placehold.co/600x400';
        const video = await prisma_1.default.video.create({
            data: {
                title,
                description,
                videoUrl,
                thumbnailUrl,
                userId,
                duration: 0,
            },
        });
        res.status(201).json(video);
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.uploadVideo = uploadVideo;
const getVideos = async (req, res) => {
    try {
        const search = req.query.search;
        let videos;
        if (search && typeof search === 'string') {
            const lowerSearch = search.toLowerCase();
            videos = await prisma_1.default.video.findMany({
                where: {
                    OR: [
                        { title: { contains: lowerSearch, mode: 'insensitive' } },
                        { description: { contains: lowerSearch, mode: 'insensitive' } },
                    ],
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        else {
            videos = await prisma_1.default.video.findMany({
                orderBy: { createdAt: 'desc' },
            });
        }
        res.json(videos);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getVideos = getVideos;
const getVideoById = async (req, res) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
        if (!id) {
            res.status(400).json({ message: 'Invalid video id' });
            return;
        }
        const video = await prisma_1.default.video.findUnique({ where: { id } });
        if (!video) {
            res.status(404).json({ message: 'Video not found' });
            return;
        }
        res.json(video);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getVideoById = getVideoById;
