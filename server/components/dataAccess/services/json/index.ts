import mongoose from 'mongoose';
import { createClient } from 'redis';
import { REDIS_JSON_URL } from '../../../../constants';
import { JsonDbService } from './jsonDbService';
const redisClient = createClient({
  url: REDIS_JSON_URL,
});

type RedisClient = typeof redisClient;

const makeJsonDbService = new JsonDbService().init({
  redisClient,
  mongoose,
});

export { redisClient, makeJsonDbService, RedisClient };
