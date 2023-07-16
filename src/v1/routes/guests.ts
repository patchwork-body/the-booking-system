import { Router } from 'express';
import { isAuthorized } from '../middlewares/is-authorized';
import { isGuest } from '../middlewares/is-guest';
import { logger } from 'src/logger';
import { guestService } from '../services';

export const guestsRouter = Router();

guestsRouter.get(
  '/guests/:id/reservations',
  isAuthorized,
  isGuest({ certain: true }),
  async (req, res) => {
    try {
      const guestReservations = await guestService.reservations(req.params.id);
      const reservations = guestReservations.map(({ reservation }) => reservation);

      return res.status(200).json({ items: reservations, cursor: reservations[0]?.id });
    } catch (error) {
      logger.fatal(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
);

guestsRouter.get(
  '/guests/:id/chats',
  isAuthorized,
  isGuest({ certain: true }),
  async (req, res) => {
    try {
      const chats = await guestService.chats(req.params.id);
      return res.status(200).json({ items: chats, cursor: chats[0]?.id });
    } catch (error) {
      logger.fatal(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
);
