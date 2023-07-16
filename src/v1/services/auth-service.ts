import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import invariant from 'tiny-invariant';

import { prisma } from './prisma/client';
import { Role, User } from '@prisma/client';

export interface AuthService {
  login: (email: string, secret: string) => Promise<{ accessToken: string; refreshToken: string }>;
  register: (user: Pick<User, 'name' | 'email' | 'phone' | 'role'>) => Promise<string>;
  refresh: (refreshToken: string) => Promise<string>;
  revoke: (refreshToken: string) => Promise<void>;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService: AuthService = {
  login: async (email, secret) => {
    invariant(process.env.JWT_SECRET, 'JWT_SECRET must be defined');
    invariant(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET must be defined');

    const user = await prisma.user.findUnique({
      where: { email },
      include: { propertyOwner: { select: { id: true } }, guest: { select: { id: true } } },
    });

    if (!user) {
      throw new AuthError('User not found');
    }

    const match = await bcrypt.compare(secret, user.password);

    if (!match) {
      throw new AuthError('Wrong password');
    }

    const token = await prisma.token.create({
      data: {
        userId: user.id,
      },
    });

    const accessToken = jwt.sign(
      {
        userId: user.id,
        ownerId: user.propertyOwner?.id,
        guestId: user.guest?.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    const refreshToken = jwt.sign(
      { userId: user.id, tokenId: token.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  },

  register: async (userData) => {
    const password = crypto
      .randomBytes(Math.ceil((32 * 3) / 4))
      .toString('base64')
      .slice(0, 32);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (userData.role !== Role.OWNER && userData.role !== Role.GUEST) {
      throw new AuthError('Invalid role');
    }

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    if (userData.role === Role.OWNER) {
      await prisma.propertyOwner.create({
        data: {
          userId: user.id,
        },
      });
    }

    if (userData.role === Role.GUEST) {
      await prisma.guest.create({
        data: {
          userId: user.id,
        },
      });
    }

    return password;
  },

  refresh: async (refreshToken) => {
    invariant(process.env.JWT_SECRET, 'JWT_SECRET must be defined');
    invariant(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET must be defined');

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (typeof decoded === 'string') {
      throw new AuthError('Invalid refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        tokens: { where: { id: decoded.tokenId }, select: { id: true } },
        propertyOwner: { select: { id: true } },
        guest: { select: { id: true } },
      },
    });

    if (!user) {
      throw new AuthError('User not found');
    }

    if (typeof user.tokens[0] === 'undefined' || user.tokens[0].id !== decoded.tokenId) {
      throw new AuthError('Invalid refresh token');
    }

    return jwt.sign(
      {
        userId: user.id,
        ownerId: user.propertyOwner?.id,
        guestId: user.guest?.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
  },

  revoke: async (refreshToken) => {
    invariant(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET must be defined');

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (typeof decoded === 'string') {
      throw new AuthError('Invalid refresh token');
    }

    await prisma.token.delete({
      where: { id: decoded.tokenId },
    });
  },
};
