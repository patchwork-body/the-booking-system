import { Router } from 'express';
import { authRouter } from './auth';
import { propertiesRouter } from './properties';

export const v1Router = Router();

v1Router.use('/v1', authRouter);
v1Router.use('/v1', propertiesRouter);
