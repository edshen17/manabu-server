import Redis from 'ioredis';
import { CacheDbService } from './cacheDbService';
declare const redisClient: Redis.Redis;
declare const makeCacheDbService: Promise<CacheDbService>;
export { makeCacheDbService, redisClient };
