import { ObjectId } from 'mongoose';

type DbServiceInitParams<OptionalDbServiceInitParams> = RequiredDbServiceInitParams &
  OptionalDbServiceInitParams;

type RequiredDbServiceInitParams = {
  makeDb: () => Promise<any>;
  cloneDeep: any;
  dbModel: any;
};

type DbServiceParams = {
  _id?: ObjectId;
  searchQuery?: StringKeyObject;
  dbServiceAccessOptions: DbServiceAccessOptions;
  modelToInsert?: StringKeyObject;
  updateQuery?: StringKeyObject;
  dbDependencyUpdateParams?: DbDependencyUpdateParams;
};

type DbServiceAccessOptions = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string;
  isSelf: boolean;
  isOverrideView?: boolean;
  isReturningParent?: boolean;
};

type DbDependencyUpdateParams = {
  updatedDependentSearchQuery?: StringKeyObject;
  embeddedUpdatedDependentSearchQuery?: StringKeyObject;
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
  findOneAndDelete: (dbServiceParams: DbServiceParams) => Promise<DbDoc>;
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
