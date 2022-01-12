import cloneDeep from 'clone-deep';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Redis from 'ioredis';
import { Graph } from 'redisgraph.js';
import {
  IS_PRODUCTION,
  REDIS_HOST,
  REDIS_HOST_DEV,
  REDIS_PASS,
  REDIS_PASS_DEV,
  REDIS_PORT,
  REDIS_PORT_DEV,
} from '../../../../constants';
import { StringKeyObject } from '../../../../types/custom';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { CacheDbService } from './cacheDbService';
dayjs.extend(customParseFormat);

const clientOptions: StringKeyObject = IS_PRODUCTION
  ? {
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASS,
    }
  : {
      host: REDIS_HOST_DEV,
      port: REDIS_PORT_DEV,
      password: REDIS_PASS_DEV,
    };

const redisClient = new Redis(clientOptions);
const redisGraph = new Graph('social-network', redisClient);

const makeCacheDbService = new CacheDbService().init({
  redisClient,
  convertStringToObjectId,
  cloneDeep,
  dayjs,
  redisGraph,
});

export { makeCacheDbService };
