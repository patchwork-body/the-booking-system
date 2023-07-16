import jwt from 'jsonwebtoken';
import invariant from 'tiny-invariant';
import { Request, Response, NextFunction } from 'express';

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  invariant(process.env.JWT_SECRET, 'JWT_SECRET must be defined');

  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const [type, token] = req.headers.authorization.split(' ');

  if (type !== 'Bearer') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof payload === 'string') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    req.jwtPayload = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
};
