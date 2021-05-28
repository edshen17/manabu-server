export interface IDbOperations {
  findById?: (id: string, currentAPIUser?: any) => Promise<any>;
  findOne: (searchQuery: {}) => Promise<any>;
  insert: (modelToInsert: {}) => Promise<any>;
  update: (searchQuery: {}) => Promise<any>;
  build: (createDbPromise: () => Promise<any>) => Promise<IDbOperations>;
}
