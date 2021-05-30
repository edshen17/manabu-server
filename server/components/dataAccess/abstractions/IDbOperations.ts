type AccessOption = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
};

interface IDbOperations {
  findById: (params: { id: string; accessOptions: any }) => Promise<any>;
  findOne: (params: { searchQuery: {}; accessOptions: any }) => Promise<any | Error>;
  insert: (params: { modelToInsert: {}; accessOptions: any }) => Promise<any | Error>;
  update: (params: {
    searchQuery: {};
    updateParams: {};
    accessOptions: any;
  }) => Promise<any | Error>;
  build: (...args: any[]) => Promise<IDbOperations>;
}

export { AccessOption, IDbOperations };
