import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma/client';

export const isOwner =
  (options?: { certain: boolean }) => async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.jwtPayload?.ownerId;

    if (!ownerId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (options?.certain && !req.params.id) {
      return res.status(400).json({ message: 'Bad request' });
    }

    if (options?.certain) {
      const property = await prisma.property.findUnique({
        where: {
          id: req.params.id,
        },
      });

      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      if (property.ownerId !== ownerId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      return next();
    }

    next();
  };
