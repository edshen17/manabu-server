import cloneDeep from 'clone-deep';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Redis from 'ioredis';
import { Graph } from 'redisgraph.js';
import { REDIS_HOST, REDIS_PASS, REDIS_PORT } from '../../../../constants';
import { StringKeyObject } from '../../../../types/custom';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { CacheDbService } from './cacheDbService';
dayjs.extend(customParseFormat);

const clientOptions: StringKeyObject = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASS,
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
