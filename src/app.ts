import { json, urlencoded } from 'body-parser';
import express, { type Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';
import { v1Router } from './v1/routes';

export const createApp = (): Express => {
  const app = express();

  const apiSpecPath =
    process.env.TEST_MODE === 'on'
      ? path.resolve(__dirname, '../public/openapi.yaml')
      : path.resolve(__dirname, './openapi.yaml');

  app
    .disable('x-powered-by')
    .use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
    .use(helmet())
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use(express.static(apiSpecPath))
    .use(
      OpenApiValidator.middleware({
        apiSpec: apiSpecPath,
        validateRequests: true,
        validateResponses: true,
      }),
    )
    .use(v1Router);

  return app;
};
