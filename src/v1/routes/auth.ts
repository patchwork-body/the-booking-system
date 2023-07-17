import { Router } from 'express';
import { AuthError, authService } from '../services';
import { logger } from 'src/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { validateRequest } from 'zod-express-middleware';
import parsePhoneNumber from 'libphonenumber-js';

export const authRouter = Router();

authRouter.post('/auth/login', async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body.email,
      req.body.secret,
    );

    res.status(200).json({
      user: {
        id: user.role === Role.OWNER ? user.propertyOwner?.id : user.guest?.id,
        userId: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },

      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.error(error.message);
      return res.status(400).json({ message: error.message });
    }

    logger.fatal(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

authRouter.post(
  '/auth/register',
  validateRequest({
    body: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().min(10).max(15),
      role: z.nativeEnum(Role),
    }),
  }),
  async (req, res) => {
    const phone = parsePhoneNumber(req.body.phone, 'RU');

    if (!phone || !phone.isValid()) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    try {
      const password = await authService.register(req.body);

      res.status(201).json({ secret: password });
    } catch (error) {
      if (error instanceof AuthError) {
        logger.error(error.message);
        return res.status(400).json({ message: error.message });
      }

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.message.includes('Unique constraint failed')
      ) {
        logger.error(error.message);
        return res.status(409).json({ message: 'User already exists' });
      }

      logger.fatal(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  },
);

authRouter.post(
  '/auth/refresh',
  validateRequest({
    body: z.object({
      refreshToken: z.string(),
    }),
  }),
  async (req, res) => {
    try {
      const accessToken = await authService.refresh(req.body.refreshToken);

      res.status(200).json({ accessToken });
    } catch (error) {
      if (error instanceof AuthError) {
        logger.error(error.message);
        return res.status(400).json({ message: error.message });
      }

      logger.fatal(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  },
);

authRouter.post(
  '/auth/revoke',
  validateRequest({
    body: z.object({
      refreshToken: z.string(),
    }),
  }),
  async (req, res) => {
    try {
      await authService.revoke(req.body.refreshToken);

      res.status(204).end();
    } catch (error) {
      if (error instanceof AuthError) {
        logger.error(error.message);
        return res.status(400).json({ message: error.message });
      }

      logger.fatal(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  },
);
