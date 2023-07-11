import serverless from 'serverless-http';
import {createServer} from '../../src/server'

export const handler = serverless(createServer());

