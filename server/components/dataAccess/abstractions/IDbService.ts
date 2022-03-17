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
  preserveCache?: boolean;
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
  COUNT_DOCUMENTS = 'count_documents',
}

// does not follow snake case because of mongo collection names
enum DB_SERVICE_COLLECTION {
  APPOINTMENTS = 'appointments',
  AVAILABLE_TIMES = 'availabletimes',
  BALANCE_TRANSACTIONS = 'balancetransactions',
  PACKAGES = 'packages',
  PACKAGE_TRANSACTIONS = 'packagetransactions',
  TEACHERS = 'teachers',
  USERS = 'users',
  INCOME_REPORTS = 'incomereports',
  CONTENTS = 'contents',
}

type DbServiceFindByIdParams = BaseDbServiceParams & SearchIdDbServiceParams;
type DbServiceFindOneParams = BaseDbServiceParams & SearchQueryDbServiceParams;
type DbServiceFindParams = BaseDbServiceParams &
  SearchQueryDbServiceParams & { paginationOptions?: PaginationOptions };
type DbServiceInsertParams = BaseDbServiceParams & { modelToInsert: StringKeyObject };
type DbServiceInsertManyParams = BaseDbServiceParams & { modelToInsert: StringKeyObject[] };
type DbServiceUpdateParams = BaseDbServiceParams &
  SearchQueryDbServiceParams & { updateQuery: StringKeyObject };

interface IDbService<OptionalDbServiceInitParams, DbServiceResponse> {
  findById: (dbServiceParams: DbServiceFindByIdParams) => Promise<DbServiceResponse>;
  findOne: (dbServiceParams: DbServiceFindOneParams) => Promise<DbServiceResponse>;
  find: (dbServiceParams: DbServiceFindParams) => Promise<DbServiceResponse[]>;
  insert: (dbServiceParams: DbServiceInsertParams) => Promise<DbServiceResponse>;
  insertMany: (dbServiceParams: DbServiceInsertManyParams) => Promise<DbServiceResponse[]>;
  findOneAndUpdate: (dbServiceParams: DbServiceUpdateParams) => Promise<DbServiceResponse>;
  updateMany: (dbServiceParams: DbServiceUpdateParams) => Promise<DbServiceResponse[]>;
  findByIdAndDelete: (dbServiceParams: DbServiceFindByIdParams) => Promise<DbServiceResponse>;
  findOneAndDelete: (dbServiceParams: DbServiceFindOneParams) => Promise<DbServiceResponse>;
  countDocuments: (dbServiceParams: DbServiceFindOneParams) => Promise<number>;
  init: (initParams: DbServiceInitParams<OptionalDbServiceInitParams>) => Promise<this>;
  getDbServiceModelViews: () => DbServiceModelViews;
  getBaseDbServiceAccessOptions: () => DbServiceAccessOptions;
  getSelfDbServiceAccessOptions: () => DbServiceAccessOptions;
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
  DB_SERVICE_COLLECTION,
  DbServiceFindByIdParams,
  DbServiceFindOneParams,
  DbServiceFindParams,
  DbServiceInsertParams,
  DbServiceInsertManyParams,
  DbServiceUpdateParams,
  CloneDeep,
  DeepEqual,
};
