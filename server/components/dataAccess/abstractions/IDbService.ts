type DbServiceParams = {
  _id?: string;
  searchQuery?: {};
  dbServiceAccessOptions: DbServiceAccessOptions;
  modelToInsert?: {};
  updateParams?: {};
  updateDbDependencies?: boolean;
};

type DbServiceAccessOptions = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string;
  isSelf: boolean;
  isOverrideView?: boolean;
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
  init: (
    initParams: {
      makeDb: () => Promise<any>;
      cloneDeep: any;
      dbModel: DbDoc;
    } & OptionalDbServiceInitParams
  ) => Promise<this>;
  getDbModelViews: () => DbModelViews;
  updateManyDbDependencies: (dbData?: any) => Promise<void>;
}

export { DbServiceAccessOptions, DbServiceParams, IDbService, DbModelViews };
