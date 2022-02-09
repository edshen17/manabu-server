/// <reference types="custom" />
import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { ClientSession, Mongoose, ObjectId } from 'mongoose';
import { StringKeyObject } from '../../../types/custom';
import { CacheDbService } from '../services/cache/cacheDbService';
declare type DbServiceInitParams<OptionalDbServiceInitParams> = RequiredDbServiceInitParams & OptionalDbServiceInitParams;
declare type RequiredDbServiceInitParams = {
    mongoose: Mongoose;
    cloneDeep: CloneDeep;
    dbModel: any;
    makeCacheDbService: Promise<CacheDbService>;
};
declare type CloneDeep = typeof cloneDeep;
declare type DeepEqual = typeof deepEqual;
declare type BaseDbServiceParams = {
    queryOptions?: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session?: ClientSession;
    preserveCache?: boolean;
};
declare type DbServiceAccessOptions = {
    isCurrentAPIUserPermitted: boolean;
    currentAPIUserRole: string;
    isSelf: boolean;
    isOverrideView?: boolean;
    isReturningParent?: boolean;
};
declare type SearchIdDbServiceParams = {
    _id: ObjectId | string | undefined;
};
declare type SearchQueryDbServiceParams = {
    searchQuery: StringKeyObject;
};
declare type PaginationOptions = {
    page: number;
    limit: number;
    sort: StringKeyObject;
};
declare enum DB_SERVICE_JOIN_TYPE {
    NONE = "none",
    LEFT_OUTER = "left_outer"
}
declare type DbServiceModelViews = {
    defaultView: {};
    adminView: {};
    selfView: {};
    overrideView: {};
};
declare enum DB_SERVICE_MODEL_VIEW {
    DEFAULT = "default",
    ADMIN = "admin",
    SELF = "self",
    OVERRIDE = "override"
}
declare enum DB_SERVICE_CACHE_CLIENT {
    FIND = "find",
    FIND_ONE = "find_one",
    FIND_BY_ID = "find_by_id",
    COUNT_DOCUMENTS = "count_documents"
}
declare enum DB_SERVICE_COLLECTION {
    APPOINTMENTS = "appointments",
    AVAILABLE_TIMES = "availabletimes",
    BALANCE_TRANSACTIONS = "balancetransactions",
    PACKAGES = "packages",
    PACKAGE_TRANSACTIONS = "packagetransactions",
    TEACHERS = "teachers",
    USERS = "users",
    INCOME_REPORT = "incomereports"
}
declare type DbServiceFindByIdParams = BaseDbServiceParams & SearchIdDbServiceParams;
declare type DbServiceFindOneParams = BaseDbServiceParams & SearchQueryDbServiceParams;
declare type DbServiceFindParams = BaseDbServiceParams & SearchQueryDbServiceParams & {
    paginationOptions?: PaginationOptions;
};
declare type DbServiceInsertParams = BaseDbServiceParams & {
    modelToInsert: StringKeyObject;
};
declare type DbServiceInsertManyParams = BaseDbServiceParams & {
    modelToInsert: StringKeyObject[];
};
declare type DbServiceUpdateParams = BaseDbServiceParams & SearchQueryDbServiceParams & {
    updateQuery: StringKeyObject;
};
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
export { DbServiceAccessOptions, IDbService, PaginationOptions, DbServiceModelViews, DbServiceInitParams, DB_SERVICE_JOIN_TYPE, DB_SERVICE_MODEL_VIEW, DB_SERVICE_CACHE_CLIENT, DB_SERVICE_COLLECTION, DbServiceFindByIdParams, DbServiceFindOneParams, DbServiceFindParams, DbServiceInsertParams, DbServiceInsertManyParams, DbServiceUpdateParams, CloneDeep, DeepEqual, };
