import cloneDeep from 'clone-deep';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Redis from 'ioredis';
import { Graph } from 'redisgraph.js';
import { StringKeyObject } from '../../../../types/custom';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { CacheDbService } from './cacheDbService';
dayjs.extend(customParseFormat);

const clientOptions: StringKeyObject = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
};

const redisClient = new Redis(clientOptions);
const redisGraph = new Graph('socialnetwork', redisClient);

const makeCacheDbService = new CacheDbService().init({
  redisClient,
  convertStringToObjectId,
  cloneDeep,
  dayjs,
  redisGraph,
});

export { makeCacheDbService };
