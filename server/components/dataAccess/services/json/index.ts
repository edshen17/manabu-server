import mongoose from 'mongoose';
import { createClient } from 'redis';
import { IS_PRODUCTION, REDIS_JSON_URL, REDIS_JSON_URL_DEV } from '../../../../constants';
import { JsonDbService } from './jsonDbService';

const redisClient = createClient({
  url: IS_PRODUCTION ? REDIS_JSON_URL : REDIS_JSON_URL_DEV,
});

const makeJsonDbService = new JsonDbService().init({
  redisClient,
  mongoose,
});

export { redisClient, makeJsonDbService };
