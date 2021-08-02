import cloneDeep from 'clone-deep';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Redis from 'ioredis';
import { Graph } from 'redisgraph.js';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { CacheDbService } from './cacheDbService';
dayjs.extend(customParseFormat);

let clientOptions: {} = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
};

// if (process.env.NODE_ENV != 'production') {
//   clientOptions = {
//     port: 6379,
//   };
// }

const redisClient = new Redis(clientOptions);
let redisGraph = new Graph('social', redisClient);

const makeCacheDbService = new CacheDbService().init({
  redisClient,
  convertStringToObjectId,
  cloneDeep,
  dayjs,
  redisGraph,
});

export { makeCacheDbService };
