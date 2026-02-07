"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    const secret = process.env.JWT_SECRET;
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err)
            return res.sendStatus(403);
        const payload = decoded;
        req.user = { userId: payload.userId };
        next();
    });
};
exports.authenticateToken = authenticateToken;
