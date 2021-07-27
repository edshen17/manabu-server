import { expect } from 'chai';
import { makeCacheDbService } from './index';
import { CacheDbService } from './cacheDbService';

let cacheDbService: CacheDbService;

before(async () => {
  cacheDbService = await makeCacheDbService;
});

beforeEach(async () => {
  await cacheDbService.set({ key: 'storedItem', value: { someVal: 5 }, ttsMs: 60 * 1000 });
});

describe('cacheDbService', () => {
  describe('get', () => {
    it('should get the item in the cache', async () => {
      const storedItem = await cacheDbService.get('storedItem');
      expect(storedItem).to.deep.equal({ someVal: 5 });
    });
  });
  describe('set', () => {
    it('should set an item in the cache', async () => {
      await cacheDbService.set({ key: 'otherItem', value: { someVal: 10 }, ttsMs: 60 * 1000 });
      const storedItem = await cacheDbService.get('otherItem');
      expect(storedItem).to.deep.equal({ someVal: 10 });
    });
  });
  describe('clearKey', () => {
    it("should clear the given key's value", async () => {
      await cacheDbService.clearKey('storedItem');
      const storedItem = await cacheDbService.get('storedItem');
      expect(storedItem).to.equal(null);
    });
  });
  describe('clearAll', () => {
    it('should clear everything in the cache', async () => {
      await cacheDbService.clearAll();
      const storedItem = await cacheDbService.get('storedItem');
      expect(storedItem).to.equal(null);
    });
  });
});
