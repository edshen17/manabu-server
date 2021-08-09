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
  modelsToInsert?: StringKeyObject[];
  updateQuery?: StringKeyObject;
  paginationOptions?: PaginationOptions;
  session?: StringKeyObject;
};

type DbServiceAccessOptions = {
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string;
  isSelf: boolean;
  isOverrideView?: boolean;
  isReturningParent?: boolean;
};

type PaginationOptions = {
  page: number;
  limit: number;
  sort: StringKeyObject;
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

enum DB_SERVICE_MODEL_VIEW {
  DEFAULT = 'default',
  ADMIN = 'admin',
  SELF = 'self',
  OVERRIDE = 'override',
}

enum DB_SERVICE_CACHE_CLIENT {
  FIND = 'find',
  FIND_ONE = 'find_one',
  FIND_BY_ID = 'find_by_id',
}

// does not follow snake case because of mongo collection names
enum DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS {
  APPOINTMENTS = 'appointments',
  MINUTE_BANKS = 'minutebanks',
  PACKAGE_TRANSACTIONS = 'packagetransactions',
  PACKAGES = 'packages',
  USERS = 'users',
  TEACHERS = 'teachers',
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
  getBaseDbServiceAccessOptions: () => DbServiceAccessOptions;
  startSession: () => Promise<any>;
}

export {
  DbServiceAccessOptions,
  DbServiceParams,
  IDbService,
  PaginationOptions,
  DbServiceModelViews,
  DbServiceInitParams,
  DB_SERVICE_JOIN_TYPE,
  DB_SERVICE_MODEL_VIEW,
  DB_SERVICE_CACHE_CLIENT,
  DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS,
};
