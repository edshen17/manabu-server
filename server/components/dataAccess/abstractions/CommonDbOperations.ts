import { IDbOperations } from './IDbOperations';

export abstract class CommonDbOperations implements IDbOperations {
  abstract findOne: (searchQuery: {}) => Promise<{} | Error>;
  abstract insert: (modelToInsert: {}) => Promise<{} | Error>;
  abstract update: (searchQuery: {}) => Promise<{} | Error>;
  async build(createDbPromise: () => Promise<any>): Promise<IDbOperations> {
    await createDbPromise();
    return this;
  }
}
