import cloneDeep from 'clone-deep';
import Redis from 'ioredis';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
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

const redisClient = new Redis(clientOptions);

const makeCacheDbService = new CacheDbService().init({
  redisClient,
  convertStringToObjectId,
  cloneDeep,
});

export { makeCacheDbService };
