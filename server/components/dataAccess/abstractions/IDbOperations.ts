export interface IDbOperations {
  findById?: (id: string, currentAPIUser?: any) => Promise<{} | Error>;
  findOne: (searchQuery: {}) => Promise<{} | Error>;
  insert: (modelToInsert: {}) => Promise<{} | Error>;
  update: (searchQuery: {}) => Promise<{} | Error>;
  clearCollectionCache: () => void;
  build: (createDbPromise: () => Promise<any>) => Promise<IDbOperations>;
}
