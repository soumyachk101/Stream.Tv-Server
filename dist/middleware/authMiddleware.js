"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
        return;
    }
    const secret = process.env.JWT_SECRET;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = { userId: decoded.userId };
        next();
    }
    catch {
        res.sendStatus(403);
    }
};
exports.authenticateToken = authenticateToken;
