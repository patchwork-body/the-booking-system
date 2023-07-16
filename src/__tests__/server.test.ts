import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import { Role } from '@prisma/client';
import { GUEST_EMAIL, OWNER_EMAIL } from './consts';
import { createApp } from 'src/app';

describe('auth', () => {
  const owner = {
    secret: '',
    accessToken: '',
    refreshToken: '',
  };

  const guest = {
    secret: '',
    accessToken: '',
    refreshToken: '',
  };

  it('register an owner', async () => {
    await supertest(createApp())
      .post('/v1/auth/register')
      .accept('application/json')
      .send({ name: 'owner', email: OWNER_EMAIL, role: Role.OWNER })
      .expect(201)
      .then((res) => {
        owner.secret = res.body.secret;

        expect(typeof res.body.secret).toBe('string');
      });
  });

  it('register a guest', async () => {
    await supertest(createApp())
      .post('/v1/auth/register')
      .accept('application/json')
      .send({ name: 'guest', email: GUEST_EMAIL, role: Role.GUEST })
      .expect(201)
      .then((res) => {
        expect(typeof res.body.secret).toBe('string');
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

        expect(typeof res.body.accessToken).toBe('string');
        expect(typeof res.body.refreshToken).toBe('string');
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

        expect(typeof res.body.accessToken).toBe('string');
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
    await supertest(createApp())
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
  });
});
