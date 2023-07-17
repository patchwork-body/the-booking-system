import supertest from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import { Role } from '@prisma/client';
import { GUEST_EMAIL, OWNER_EMAIL } from './consts';
import { createApp } from 'src/app';
import { prisma } from '@app/v1/services/prisma/client';
import dayjs from 'dayjs';
import invariant from 'tiny-invariant';

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

describe('auth', () => {
  const owner = {
    id: '',
    secret: '',
    accessToken: '',
    refreshToken: '',
    properties: [] as string[],
  };

  const guest = {
    secret: '',
    accessToken: '',
    refreshToken: '',
    reservationId: '',
  };

  let chatId = '';

  it('register an owner', async () => {
    await supertest(createApp())
      .post('/v1/auth/register')
      .accept('application/json')
      .send({ name: 'owner', email: OWNER_EMAIL, phone: '+38165129023', role: Role.OWNER })
      .expect(201)
      .then((res) => {
        owner.secret = res.body.secret;

        expect(typeof res.body.secret).toEqual('string');
      });
  });

  it('register a guest', async () => {
    await supertest(createApp())
      .post('/v1/auth/register')
      .accept('application/json')
      .send({ name: 'guest', email: GUEST_EMAIL, phone: '+38165129823', role: Role.GUEST })
      .expect(201)
      .then((res) => {
        guest.secret = res.body.secret;

        expect(typeof res.body.secret).toEqual('string');
      });
  });

  it('login with a registered owner', async () => {
    await supertest(createApp())
      .post('/v1/auth/login')
      .accept('application/json')
      .send({ email: OWNER_EMAIL, secret: owner.secret })
      .expect(200)
      .then((res) => {
        owner.refreshToken = res.body.refreshToken;

        expect(typeof res.body.accessToken).toEqual('string');
        expect(typeof res.body.refreshToken).toEqual('string');
      });
  });

  it('refresh access token', async () => {
    await supertest(createApp())
      .post('/v1/auth/refresh')
      .accept('application/json')
      .send({ refreshToken: owner.refreshToken })
      .expect(200)
      .then((res) => {
        owner.accessToken = res.body.accessToken;

        expect(typeof res.body.accessToken).toEqual('string');
      });
  });

  it('revoke refresh token', async () => {
    await supertest(createApp())
      .post('/v1/auth/revoke')
      .accept('application/json')
      .send({ refreshToken: owner.refreshToken })
      .expect(204);
  });

  it('create a property as an owner', async () => {
    const response = await supertest(createApp())
      .post('/v1/properties')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .accept('application/json')
      .send({
        name: 'Property 1',
        description: 'Description 1',
        address: 'Address 1',
        price: 1000000,
        currency: 'IDR',
        bathrooms: 1,
        bedrooms: 1,
      })
      .expect(201);

    owner.properties.push(response.body.id);
  });

  it('login with a registered guest', async () => {
    await supertest(createApp())
      .post('/v1/auth/login')
      .accept('application/json')
      .send({ email: GUEST_EMAIL, secret: guest.secret })
      .expect(200)
      .then((res) => {
        guest.accessToken = res.body.accessToken;
        guest.refreshToken = res.body.refreshToken;

        expect(typeof res.body.accessToken).toEqual('string');
        expect(typeof res.body.refreshToken).toEqual('string');
      });
  });

  it('create a property as a guest should throw an error', async () => {
    await supertest(createApp())
      .post('/v1/properties')
      .set('Authorization', `Bearer ${guest.accessToken}`)
      .accept('application/json')
      .send({
        name: 'Property 2',
        description: 'Description 1',
        address: 'Address 2',
        price: 1000000,
        currency: 'IDR',
        bathrooms: 1,
        bedrooms: 1,
      })
      .expect(403);
  });

  it('find property by id', async () => {
    await supertest(createApp())
      .get(`/v1/properties/${owner.properties[0]}`)
      .expect(200)
      .then((res) => {
        expect(res.body.name).toEqual('Property 1');
      });
  });

  it('find all properties', async () => {
    await supertest(createApp())
      .get('/v1/properties')
      .expect(200)
      .then((res) => {
        expect(res.body.items.length).toBeGreaterThan(0);
      });
  });

  it('update property by id', async () => {
    await supertest(createApp())
      .patch(`/v1/properties/${owner.properties[0]}`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .accept('application/json')
      .send({
        name: 'Property 2',
        description: 'Description 2',
        address: 'Address 2',
        price: 1000000,
        currency: 'IDR',
        bathrooms: 2,
        bedrooms: 2,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.name).toEqual('Property 2');
      });
  });

  it('get property owner', async () => {
    await supertest(createApp())
      .get(`/v1/properties/${owner.properties[0]}/owner`)
      .expect(200)
      .then((res) => {
        owner.id = res.body.id;

        expect(res.body.email).toEqual(OWNER_EMAIL);
      });
  });

  it('get all property reservations (should be none)', async () => {
    await supertest(createApp())
      .get(`/v1/properties/${owner.properties[0]}/reservations`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.items.length).toEqual(0);
      });
  });

  it('create property reservation', async () => {
    const guestIds = await prisma.guest.findMany({
      select: { id: true },
    });

    await supertest(createApp())
      .post(`/v1/properties/${owner.properties[0]}/reservations`)
      .set('Authorization', `Bearer ${guest.accessToken}`)
      .accept('application/json')
      .send({
        checkIn: dayjs().add(1, 'day').toISOString(),
        checkOut: dayjs().add(2, 'day').toISOString(),
        guestIds: guestIds.map((guest) => guest.id),
      })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('get all property reservations (should be some)', async () => {
    await supertest(createApp())
      .get(`/v1/properties/${owner.properties[0]}/reservations`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.items.length).toEqual(1);
      });
  });

  it('get all property chats (should be none)', async () => {
    await supertest(createApp())
      .get(`/v1/properties/${owner.properties[0]}/chats`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.items.length).toEqual(0);
      });
  });

  it('get all guest reservations (should be some)', async () => {
    const user = await prisma.user.findUnique({
      where: { email: GUEST_EMAIL },
      select: { guest: { select: { id: true } } },
    });

    await supertest(createApp())
      .get(`/v1/guests/${user?.guest?.id}/reservations`)
      .set('Authorization', `Bearer ${guest.accessToken}`)
      .expect(200)
      .then((res) => {
        guest.reservationId = res.body.items[0].id;

        expect(res.body.items.length).toEqual(1);
      });
  });

  it('get reservation by id (as user)', async () => {
    await supertest(createApp())
      .get(`/v1/reservations/${guest.reservationId}`)
      .set('Authorization', `Bearer ${guest.accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.id).toEqual(guest.reservationId);
      });
  });

  it('get reservation by id (as owner)', async () => {
    await supertest(createApp())
      .get(`/v1/reservations/${guest.reservationId}`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.id).toEqual(guest.reservationId);
      });
  });

  it('get all guest chats', async () => {
    const guestUser = await prisma.user.findUnique({
      where: { email: GUEST_EMAIL },
      select: { id: true, guest: { select: { id: true } } },
    });

    const ownerUser = await prisma.user.findUnique({
      where: { email: OWNER_EMAIL },
      select: { id: true },
    });

    invariant(guestUser, 'guestUser is not defined');
    invariant(ownerUser, 'ownerUser is not defined');

    const chat = await prisma.chat.create({
      data: {
        property: { connect: { id: owner.properties[0] } },
        participants: {
          createMany: {
            data: [{ userId: guestUser?.id }, { userId: ownerUser?.id }],
          },
        },
      },
    });

    chatId = chat.id;

    await supertest(createApp())
      .get(`/v1/guests/${guestUser.guest?.id}/chats`)
      .set('Authorization', `Bearer ${guest.accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.items.length).toEqual(1);
        expect(res.body.items[0].id).toEqual(chat.id);
      });
  });

  it('get all property chats', async () => {
    await supertest(createApp())
      .get(`/v1/properties/${owner.properties[0]}/chats`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.items.length).toEqual(1);
        expect(res.body.items[0].id).toEqual(chatId);
      });
  });

  it('get all chat messages as guest participant', async () => {
    await supertest(createApp())
      .get(`/v1/chats/${chatId}/messages`)
      .set('Authorization', `Bearer ${guest.accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.items.length).toEqual(0);
      });
  });
});
