import { IDbOperations } from './IDbOperations';

export abstract class CommonDbOperations implements IDbOperations {
  protected cacheService: any;
  public collectionName: string;

  constructor(dbData: any) {
    this.cacheService = dbData.cacheService;
    this.collectionName = dbData.collectionName;
  }

  abstract findOne: (searchQuery: {}) => Promise<{} | Error>;
  abstract insert: (modelToInsert: {}) => Promise<{} | Error>;
  abstract update: (searchQuery: {}) => Promise<{} | Error>;

  clearCollectionCache(): void {
    this.cacheService.clearKey(this.collectionName);
  }

  async build(createDbPromise: () => Promise<any>): Promise<IDbOperations> {
    await createDbPromise();
    return this;
  }
}
