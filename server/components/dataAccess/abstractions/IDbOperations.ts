type AccessOptions = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string;
  isSelf: boolean;
};

type DbParams = {
  id?: string;
  searchQuery?: {};
  accessOptions: AccessOptions;
  modelToInsert?: {};
  updateParams?: {};
};

interface IDbOperations<DbDoc> {
  findById: (params: DbParams) => Promise<DbDoc>;
  findOne: (params: DbParams) => Promise<DbDoc>;
  find: (params: DbParams) => Promise<[DbDoc]>;
  insert: (params: DbParams) => Promise<DbDoc>;
  update: (params: DbParams) => Promise<DbDoc>;
  build: (...args: any[]) => Promise<this>;
}

export { AccessOptions, DbParams, IDbOperations };
