export interface IDbOperations<T> {
  connectedDb: Promise<T>;
  findOne: (attributes: {}) => {} | Error;
  insert: (modelToInsert: {}) => {} | Error;
  update: (attributes: {}) => {} | Error;
  clearCollectionCache: (collection: string) => void;
  build: (dbPromise: () => Promise<T>) => any;
}
