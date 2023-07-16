import { Router } from 'express';
import { authRouter } from './auth';
import { propertiesRouter } from './properties';
import { reservationsRouter } from './reservations';
import { chatsRouter } from './chats';
import { guestsRouter } from './guests';

export const v1Router = Router();

v1Router.use('/v1', authRouter);
v1Router.use('/v1', propertiesRouter);
v1Router.use('/v1', guestsRouter);
v1Router.use('/v1', reservationsRouter);
v1Router.use('/v1', chatsRouter);
