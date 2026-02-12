import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }

  const secret = process.env.JWT_SECRET!;
  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch {
    res.sendStatus(403);
  }
};
