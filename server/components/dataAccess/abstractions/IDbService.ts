type DbServiceInitParams<OptionalDbServiceInitParams> = RequiredDbServiceInitParams &
  OptionalDbServiceInitParams;

type RequiredDbServiceInitParams = {
  makeDb: () => Promise<any>;
  cloneDeep: any;
  dbModel: any;
};

type DbServiceParams = {
  _id?: string;
  searchQuery?: {};
  dbServiceAccessOptions: DbServiceAccessOptions;
  modelToInsert?: {};
  updateParams?: {};
  dbDependencyUpdateParams?: DbDependencyUpdateParams;
};

type DbServiceAccessOptions = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string;
  isSelf: boolean;
  isOverrideView?: boolean;
};

type DbDependencyUpdateParams = {
  updatedDependentSearchQuery?: {};
};

type DbModelViews = {
  defaultView: {};
  adminView?: {};
  selfView?: {};
  overrideView?: {};
};

interface IDbService<OptionalDbServiceInitParams, DbDoc> {
  findById: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  findOne: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  find: (dbServiceParams: DbServiceParams) => Promise<DbDoc[]>;
  insert: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  insertMany: (dbServiceParams: DbServiceParams) => Promise<DbDoc[]>;
  findOneAndUpdate: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  updateMany: (dbServiceParams: DbServiceParams) => Promise<DbDoc[]>;
  findByIdAndDelete: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  init: (initParams: DbServiceInitParams<OptionalDbServiceInitParams>) => Promise<this>;
  getDbModelViews: () => DbModelViews;
}

export {
  DbServiceAccessOptions,
  DbServiceParams,
  IDbService,
  DbModelViews,
  DbDependencyUpdateParams,
  DbServiceInitParams,
};
