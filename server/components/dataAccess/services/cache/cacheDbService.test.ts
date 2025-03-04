import { expect } from 'chai';
import { CacheDbService } from './cacheDbService';
import { makeCacheDbService } from './index';

let cacheDbService: CacheDbService;
let hashKey: string;

before(async () => {
  cacheDbService = await makeCacheDbService;
});

beforeEach(async () => {
  hashKey = 'someHashKey';
  await cacheDbService.set({
    hashKey,
    key: 'storeditem',
    value: { _id: 5 },
    ttlMs: 60 * 1000,
  });
});

describe('cacheDbService', () => {
  describe('get', () => {
    it('should get the item in the cache', async () => {
      const storedItem = await cacheDbService.get({ hashKey, key: 'storeditem' });
      expect(storedItem).to.deep.equal({ _id: 5 });
    });
  });
  describe('set', () => {
    it('should set an item in the cache', async () => {
      const storedItem = await cacheDbService.set({
        hashKey,
        key: 'otheritem',
        value: { _id: 10 },
        ttlMs: 60 * 1000,
      });
      expect(storedItem).to.deep.equal({ _id: 10 });
    });
  });
  describe('clearKey', () => {
    it("should clear the given key's value", async () => {
      await cacheDbService.clearKey({ hashKey, key: 'storeditem' });
      const storedItem = await cacheDbService.get({ hashKey, key: 'storeditem' });
      expect(storedItem).to.equal(null);
    });
  });
  describe('clearHashKey', () => {
    it("should clear the given hashKey's value", async () => {
      await cacheDbService.clearHashKey(hashKey);
      const storedItem = await cacheDbService.get({ hashKey, key: 'storeditem' });
      expect(storedItem).to.equal(null);
    });
  });
});
