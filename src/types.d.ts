// types/express.d.ts

import jwt from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    jwtPayload?: jwt.JwtPayload;
  }
}
