import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  const secret = process.env.JWT_SECRET!;
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const payload = decoded as { userId: string };
    req.user = { userId: payload.userId };
    next();
  });
};
