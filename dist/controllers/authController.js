"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_mock_1 = require("../lib/db_mock");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_USERNAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 255;
function validateRegisterBody(body) {
    if (!body || typeof body !== 'object') {
        return { error: 'Invalid request body' };
    }
    const { email, password, username } = body;
    if (typeof email !== 'string' || !email.trim()) {
        return { error: 'Email is required' };
    }
    if (typeof username !== 'string' || !username.trim()) {
        return { error: 'Username is required' };
    }
    if (typeof password !== 'string') {
        return { error: 'Password is required' };
    }
    if (!EMAIL_REGEX.test(email.trim())) {
        return { error: 'Invalid email format' };
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
    }
    if (username.trim().length > MAX_USERNAME_LENGTH) {
        return { error: 'Username is too long' };
    }
    if (email.length > MAX_EMAIL_LENGTH) {
        return { error: 'Email is too long' };
    }
    return {
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password,
    };
}
function validateLoginBody(body) {
    if (!body || typeof body !== 'object') {
        return { error: 'Invalid request body' };
    }
    const { email, password } = body;
    if (typeof email !== 'string' || !email.trim()) {
        return { error: 'Email is required' };
    }
    if (typeof password !== 'string') {
        return { error: 'Password is required' };
    }
    return { email: email.trim().toLowerCase(), password };
}
const register = async (req, res) => {
    try {
        const validated = validateRegisterBody(req.body);
        if ('error' in validated) {
            return res.status(400).json({ message: validated.error });
        }
        const { email, password, username } = validated;
        const existingUser = await db_mock_1.db.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await db_mock_1.db.createUser({
            email,
            password: hashedPassword,
            username,
        });
        const secret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validated = validateLoginBody(req.body);
        if ('error' in validated) {
            return res.status(400).json({ message: validated.error });
        }
        const { email, password } = validated;
        const user = await db_mock_1.db.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const secret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: '7d' });
        res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
