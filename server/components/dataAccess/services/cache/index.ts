import { createNodeRedisClient } from 'handy-redis';
import { CacheDbService } from './cacheDbService';

let clientOptions: {} = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
};

if (process.env.NODE_ENV != 'production') {
  clientOptions = {
    port: 6379,
  };
}

const redisClient = createNodeRedisClient(clientOptions);

const makeCacheDbService = new CacheDbService().init({ redisClient });

export { makeCacheDbService };
