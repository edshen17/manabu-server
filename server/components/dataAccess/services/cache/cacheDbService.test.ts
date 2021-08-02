import { expect } from 'chai';
import { makeCacheDbService } from './index';
import { CacheDbService } from './cacheDbService';

let cacheDbService: CacheDbService;
let hashKey: string;

before(async () => {
  cacheDbService = await makeCacheDbService;
});

beforeEach(async () => {
  hashKey = 'someHashKey';
  await cacheDbService.set({
    hashKey,
    key: 'storedItem',
    value: { _id: 5 },
    ttlMs: 60 * 1000,
  });
});

describe('cacheDbService', () => {
  describe('get', () => {
    it('should get the item in the cache', async () => {
      const storedItem = await cacheDbService.get({ hashKey, key: 'storedItem' });
      expect(storedItem).to.deep.equal({ _id: 5 });
    });
  });
  describe('set', () => {
    it('should set an item in the cache', async () => {
      await cacheDbService.set({ hashKey, key: 'otherItem', value: { _id: 10 }, ttlMs: 60 * 1000 });
      const storedItem = await cacheDbService.get({ hashKey, key: 'otherItem' });
      expect(storedItem).to.deep.equal({ _id: 10 });
    });
  });
  describe('clearKey', () => {
    it("should clear the given key's value", async () => {
      await cacheDbService.clearKey({ hashKey, key: 'storedItem' });
      const storedItem = await cacheDbService.get({ hashKey, key: 'storedItem' });
      expect(storedItem).to.equal(null);
    });
  });
  describe('clearHashKey', () => {
    it("should clear the given hashKey's value", async () => {
      await cacheDbService.clearHashKey(hashKey);
      const storedItem = await cacheDbService.get({ hashKey, key: 'storedItem' });
      expect(storedItem).to.equal(null);
    });
  });
  describe('clearAll', () => {
    it('should clear everything in the cache', async () => {
      await cacheDbService.clearAll();
      const storedItem = await cacheDbService.get({ hashKey, key: 'storedItem' });
      expect(storedItem).to.equal(null);
    });
  });
  describe('graphQuery', () => {
    it('should make a graph query', async () => {
      await cacheDbService.graphQuery("CREATE (:person{name:'roi',age:32})");
      await cacheDbService.graphQuery("CREATE (:person{name:'amit',age:30})");
      await cacheDbService.graphQuery(
        "MATCH (a:person), (b:person) WHERE (a.name = 'roi' AND b.name='amit') CREATE (a)-[:knows]->(b)"
      );
      const res = await cacheDbService.graphQuery(
        'MATCH (a:person)-[:knows]->(:person) RETURN a.name'
      );
      while (res.hasNext()) {
        let record = res.next();
        expect(record.get('a.name')).to.equal('roi');
      }
    });
  });
});
