import { Request, Response, NextFunction } from 'express';

export const isGuest =
  (options?: { certain: boolean }) => async (req: Request, res: Response, next: NextFunction) => {
    const guestId = req.jwtPayload?.guestId;

    if (!guestId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (options?.certain && !req.params.id) {
      return res.status(400).json({ message: 'Bad request' });
    }

    if (options?.certain) {
      if (req.params.id !== guestId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      return next();
    }

    next();
  };
