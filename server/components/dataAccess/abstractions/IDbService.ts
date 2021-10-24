import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { ClientSession, Mongoose, ObjectId } from 'mongoose';
import { StringKeyObject } from '../../../types/custom';
import { CacheDbService } from '../services/cache/cacheDbService';

type DbServiceInitParams<OptionalDbServiceInitParams> = RequiredDbServiceInitParams &
  OptionalDbServiceInitParams;

type RequiredDbServiceInitParams = {
  mongoose: Mongoose;
  cloneDeep: CloneDeep;
  dbModel: any;
  makeCacheDbService: Promise<CacheDbService>;
};

type CloneDeep = typeof cloneDeep;
type DeepEqual = typeof deepEqual;

type BaseDbServiceParams = {
  queryOptions?: StringKeyObject;
  dbServiceAccessOptions: DbServiceAccessOptions;
  session?: ClientSession;
};

type DbServiceAccessOptions = {
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string;
  isSelf: boolean;
  isOverrideView?: boolean;
  isReturningParent?: boolean;
};

type SearchIdDbServiceParams = { _id: ObjectId | string | undefined };

type SearchQueryDbServiceParams = { searchQuery: StringKeyObject };

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

type DbServiceFindByIdParams = BaseDbServiceParams & SearchIdDbServiceParams;
type DbServiceFindOneParams = BaseDbServiceParams & SearchQueryDbServiceParams;
type DbServiceFindParams = BaseDbServiceParams &
  SearchQueryDbServiceParams & { paginationOptions?: PaginationOptions };
type DbServiceInsertParams = BaseDbServiceParams & { modelToInsert: StringKeyObject };
type DbServiceInsertManyParams = BaseDbServiceParams & { modelToInsert: StringKeyObject[] };
type DbServiceUpdateParams = BaseDbServiceParams &
  SearchQueryDbServiceParams & { updateQuery: StringKeyObject };

interface IDbService<OptionalDbServiceInitParams, DbDoc> {
  findById: (dbServiceParams: DbServiceFindByIdParams) => Promise<DbDoc>;
  findOne: (dbServiceParams: DbServiceFindOneParams) => Promise<DbDoc>;
  find: (dbServiceParams: DbServiceFindParams) => Promise<DbDoc[]>;
  insert: (dbServiceParams: DbServiceInsertParams) => Promise<DbDoc>;
  insertMany: (dbServiceParams: DbServiceInsertManyParams) => Promise<DbDoc[]>;
  findOneAndUpdate: (dbServiceParams: DbServiceUpdateParams) => Promise<DbDoc>;
  updateMany: (dbServiceParams: DbServiceUpdateParams) => Promise<DbDoc[]>;
  findByIdAndDelete: (dbServiceParams: DbServiceFindByIdParams) => Promise<DbDoc>;
  findOneAndDelete: (dbServiceParams: DbServiceFindOneParams) => Promise<DbDoc>;
  init: (initParams: DbServiceInitParams<OptionalDbServiceInitParams>) => Promise<this>;
  getDbServiceModelViews: () => DbServiceModelViews;
  getBaseDbServiceAccessOptions: () => DbServiceAccessOptions;
  getOverrideDbServiceAccessOptions: () => DbServiceAccessOptions;
  startSession: () => Promise<ClientSession>;
}

export {
  DbServiceAccessOptions,
  IDbService,
  PaginationOptions,
  DbServiceModelViews,
  DbServiceInitParams,
  DB_SERVICE_JOIN_TYPE,
  DB_SERVICE_MODEL_VIEW,
  DB_SERVICE_CACHE_CLIENT,
  DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS,
  DbServiceFindByIdParams,
  DbServiceFindOneParams,
  DbServiceFindParams,
  DbServiceInsertParams,
  DbServiceInsertManyParams,
  DbServiceUpdateParams,
  CloneDeep,
  DeepEqual,
};
