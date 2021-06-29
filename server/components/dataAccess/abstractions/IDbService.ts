type DbServiceParams = {
  _id?: string;
  searchQuery?: { [key: string]: any };
  dbServiceAccessOptions: DbServiceAccessOptions;
  modelToInsert?: { [key: string]: any };
  updateParams?: { [key: string]: any };
};

type DbServiceAccessOptions = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string | undefined;
  isSelf: boolean;
  isOverridingSelectOptions?: boolean;
};

type DbServiceDefaultSelectOptions = {
  defaultSettings: {};
  adminSettings?: {};
  isSelfSettings?: {};
  overrideSettings?: {};
};

interface IDbService<DbServiceInitParams, DbDoc> {
  findById: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  findOne: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  find: (dbServiceParams: DbServiceParams) => Promise<DbDoc[]>;
  insert: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  insertMany: (dbServiceParams: DbServiceParams) => Promise<DbDoc[]>;
  findOneAndUpdate: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  updateMany: (dbServiceParams: DbServiceParams) => Promise<DbDoc[]>;
  findByIdAndDelete: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
  init: (
    props: {
      makeDb: Promise<IDbService<DbServiceInitParams, DbDoc>>;
      cloneDeep: any;
      dbModel: DbDoc;
    } & DbServiceInitParams
  ) => Promise<this>;
  getDefaultSelectOptions: () => DbServiceDefaultSelectOptions;
}

export { DbServiceAccessOptions, DbServiceParams, IDbService, DbServiceDefaultSelectOptions };
