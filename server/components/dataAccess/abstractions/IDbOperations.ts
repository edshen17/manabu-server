export interface IDbOperations<DbType> {
  findById?: (id: string) => Promise<{} | Error>;
  findOne: (searchQuery: {}) => Promise<{} | Error>;
  insert: (modelToInsert: {}) => Promise<{} | Error>;
  update: (searchQuery: {}) => Promise<{} | Error>;
  clearCollectionCache: (collection: string) => void;
  build: (createDbPromise: () => Promise<DbType>) => Promise<IDbOperations<DbType>>;
}
