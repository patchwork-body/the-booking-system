import { prisma } from '@app/v1/services/prisma/client';
import { beforeAll } from 'vitest';
import { GUEST_EMAIL, OWNER_EMAIL } from './consts';

const clear = async () => {
  const deleteOwner = prisma.user.delete({ where: { email: OWNER_EMAIL } });
  const deleteGuest = prisma.user.delete({ where: { email: GUEST_EMAIL } });

  try {
    await prisma.$transaction([deleteOwner, deleteGuest]);
  } catch (error) {
    // we can ignore this error
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

beforeAll(clear);
