"use strict";
// import mongoose from 'mongoose';
// import redis, { RedisClient } from 'redis';
// import util from 'util';
// let clientOptions: {} = {
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASS,
// };
// if (process.env.NODE_ENV != 'production') {
//   clientOptions = {
//     port: 6379,
//   };
// }
// const client = redis.createClient(clientOptions);
// client.hgetPromise = util.promisify(client.hget);
// const exec = mongoose.Query.prototype.exec;
// mongoose.Query.prototype.cache = function (options: any) {
//   this.useCache = true;
//   this.time = 24 * 60 * 60 * 1000;
//   this.hashKey = JSON.stringify(this.mongooseCollection.name);
//   this.queryKey = options.queryKey;
//   return this;
// };
// mongoose.Query.prototype.exec = async function () {
//   if (!this.useCache) {
//     return await exec.apply(this, arguments);
//   }
//   const key =
//     JSON.stringify(this.queryKey) ||
//     JSON.stringify({
//       ...this.getQuery(),
//     });
//   const cacheValue = await client.hgetPromise(this.hashKey, key);
//   if (cacheValue && cacheValue !== 'null') {
//     const doc = JSON.parse(cacheValue);
//     return Array.isArray(doc) ? doc.map((d) => new this.model(d)) : new this.model(doc);
//   }
//   const result = await exec.apply(this, arguments);
//   client.hset(this.hashKey, key, JSON.stringify(result));
//   client.expire(this.hashKey, this.time);
//   return result;
// };
// class CacheService {
//   private static client: RedisClient = client;
//   public clearKey = (hashKey: unknown): void => {
//     CacheService.client.del(JSON.stringify(hashKey));
//   };
//   public clearSpecificKey = (hashKey: unknown, key: unknown): void => {
//     client.hdel(JSON.stringify(hashKey), JSON.stringify(key));
//   };
//   public updateSpecificKey = (hashKey: unknown, key: unknown, value: unknown): void => {
//     client.hset(JSON.stringify(hashKey), JSON.stringify(key), JSON.stringify(value));
//   };
// }
// // client.flushdb(function (err, succeeded) {
// //   console.log(succeeded); // will be true if successfull
// // });
// export { CacheService };
