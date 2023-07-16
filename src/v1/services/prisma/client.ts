/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export const prisma =
  prismaGlobal.prisma ||
  new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  });

if (isProd) {
  prismaGlobal.prisma = prisma;
}
