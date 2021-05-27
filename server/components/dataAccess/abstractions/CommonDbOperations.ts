import { IDbOperations } from './IDbOperations';

export abstract class CommonDbOperations<DbType> implements IDbOperations<DbType> {
  protected cacheService: any;

  constructor(cacheService: any) {
    this.cacheService = cacheService;
  }

  abstract findOne: (searchQuery: {}) => Promise<{} | Error>;
  abstract insert: (modelToInsert: {}) => Promise<{} | Error>;
  abstract update: (searchQuery: {}) => Promise<{} | Error>;

  clearCollectionCache(collection: string): void {
    this.cacheService.clearKey(collection);
  }

  async build(createDbPromise: () => Promise<DbType>): Promise<this> {
    await createDbPromise();
    return this;
  }
}
