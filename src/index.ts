import { createApp } from './app';
import { logger } from './logger';

const port = process.env.PORT || 5001;
const server = createApp();

server.listen(Number(port), '0.0.0.0', () => {
  logger.info(`Server is listening on port ${port}`);
});
