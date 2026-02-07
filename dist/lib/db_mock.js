"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
class InMemoryDB {
    constructor() {
        this.users = [];
        this.sessions = [];
        this.videos = [];
    }
    // User Methods
    async findUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }
    async createUser(user) {
        const newUser = {
            ...user,
            id: Math.random().toString(36).substring(7),
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }
    // Video Methods
    async createVideo(video) {
        const newVideo = {
            ...video,
            id: Math.random().toString(36).substring(7),
            views: 0,
            createdAt: new Date(),
        };
        this.videos.push(newVideo);
        return newVideo;
    }
    async getAllVideos() {
        return this.videos;
    }
    async getVideoById(id) {
        return this.videos.find(v => v.id === id);
    }
}
exports.db = new InMemoryDB();
