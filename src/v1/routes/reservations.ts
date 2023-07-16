import { Router, Request, Response } from 'express';
import { isAuthorized } from '../middlewares/is-authorized';
import { logger } from 'src/logger';
import { reservationService } from '../services';
import { Role } from '@prisma/client';

export const reservationsRouter = Router();

reservationsRouter.get('/reservations/:id', isAuthorized, async (req: Request, res: Response) => {
  try {
    const reservation = await reservationService.byId(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (
      req.jwtPayload?.role === Role.OWNER &&
      req.jwtPayload?.ownerId !== reservation?.property.ownerId
    ) {
      return res
        .status(403)
        .json({ message: 'You should be a property owner to see this reservation' });
    } else if (
      req.jwtPayload?.role === Role.GUEST &&
      !reservation.guests.some((guest) => guest.guestId === req.jwtPayload?.guestId)
    ) {
      return res
        .status(403)
        .json({ message: 'You should be a one of the guest for this reservation to see it' });
    }

    const { guests: propertyGuests, ...rest } = reservation;

    const guests = propertyGuests.map(({ guest }) => {
      const { user, ...rest } = guest;

      return {
        ...rest,
        ...user,
      };
    });

    return res.status(200).json({ ...rest, guests });
  } catch (error) {
    logger.fatal(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});
