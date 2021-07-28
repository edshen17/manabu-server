import { ObjectId } from 'mongoose';
import { CacheDbService } from '../services/cache/cacheDbService';

type DbServiceInitParams<OptionalDbServiceInitParams> = RequiredDbServiceInitParams &
  OptionalDbServiceInitParams;

type RequiredDbServiceInitParams = {
  makeDb: () => Promise<any>;
  cloneDeep: any;
  dbModel: any;
  makeCacheDbService: Promise<CacheDbService>;
};

type DbServiceParams = {
  _id?: ObjectId;
  searchQuery?: StringKeyObject;
  dbServiceAccessOptions: DbServiceAccessOptions;
  modelToInsert?: StringKeyObject;
  updateQuery?: StringKeyObject;
};

type DbServiceAccessOptions = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string;
  isSelf: boolean;
  isOverrideView?: boolean;
  isReturningParent?: boolean;
};

enum DB_SERVICE_JOIN_TYPE {
  NONE = 'none',
  LEFT_OUTER = 'left_outer',
}

type DbServiceModelViews = {
  defaultView: {};
  adminView: {};
  selfView: {};
  overrideView: {};
};

enum DB_SERVICE_MODEL_VIEWS {
  DEFAULT = 'default',
  ADMIN = 'admin',
  SELF = 'self',
  OVERRIDE = 'override',
}

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
  getDbServiceModelViews: () => DbServiceModelViews;
}

export {
  DbServiceAccessOptions,
  DbServiceParams,
  IDbService,
  DbServiceModelViews,
  DbServiceInitParams,
  DB_SERVICE_JOIN_TYPE,
  DB_SERVICE_MODEL_VIEWS,
};
