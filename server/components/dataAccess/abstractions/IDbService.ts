type DbServiceParams = {
  _id?: string;
  searchQuery?: {};
  dbServiceAccessOptions: DbServiceAccessOptions;
  modelToInsert?: {};
  updateParams?: {};
};

type DbServiceAccessOptions = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string | undefined;
  isSelf: boolean;
  isOverrideView?: boolean;
};

type DbModelViews = {
  defaultView: {};
  adminView?: {};
  selfView?: {};
  overrideView?: {};
};

interface IDbService<PartialDbServiceInitParams, DbDoc> {
  findById: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  findOne: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  find: (dbServiceParams: DbServiceParams) => Promise<DbDoc[]>;
  insert: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  insertMany: (dbServiceParams: DbServiceParams) => Promise<DbDoc[]>;
  findOneAndUpdate: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  updateMany: (dbServiceParams: DbServiceParams) => Promise<DbDoc[]>;
  findByIdAndDelete: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  init: (
    dbServiceInitParams: {
      makeDb: () => Promise<any>;
      cloneDeep: any;
      dbModel: DbDoc;
    } & PartialDbServiceInitParams
  ) => Promise<this>;
  getDbModelViews: () => DbModelViews;
}

export { DbServiceAccessOptions, DbServiceParams, IDbService, DbModelViews };
