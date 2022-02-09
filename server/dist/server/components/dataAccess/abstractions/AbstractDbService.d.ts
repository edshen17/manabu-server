import { ClientSession, Mongoose, ObjectId } from 'mongoose';
import { StringKeyObject } from '../../../types/custom';
import { CacheDbService } from '../services/cache/cacheDbService';
import { CloneDeep, DbServiceAccessOptions, DbServiceFindByIdParams, DbServiceFindOneParams, DbServiceFindParams, DbServiceInitParams, DbServiceInsertManyParams, DbServiceInsertParams, DbServiceModelViews, DbServiceUpdateParams, IDbService } from './IDbService';
declare abstract class AbstractDbService<OptionalDbServiceInitParams, DbServiceResponse> implements IDbService<OptionalDbServiceInitParams, DbServiceResponse> {
    protected _dbModel: any;
    protected _dbModelName: string;
    protected _cloneDeep: CloneDeep;
    protected _joinType: string;
    protected _ttlMs: number;
    protected _cacheDbService: CacheDbService;
    protected _mongoose: Mongoose;
    protected _getDbServiceModelViews: () => DbServiceModelViews;
    findOne: (props: DbServiceFindOneParams) => Promise<DbServiceResponse>;
    private _getDbServiceModelView;
    protected _getCacheKey: (props: {
        searchQuery?: StringKeyObject;
        modelViewName: string;
        cacheClient: string;
    }) => string;
    private _testAccessPermitted;
    private _getCacheData;
    private _handleStoredData;
    protected _getDbQueryResult: (props: {
        dbServiceAccessOptions: DbServiceAccessOptions;
        dbQueryPromise: any;
        searchQuery?: StringKeyObject;
    }) => Promise<any>;
    private _executeQuery;
    private _joinDbDoc;
    getBaseDbServiceAccessOptions: () => DbServiceAccessOptions;
    protected _getComputedProps: (props: {
        dbDoc: any;
        dbServiceAccessOptions: DbServiceAccessOptions;
    }) => Promise<StringKeyObject>;
    private _setCacheData;
    protected _getDbDataById: (props: {
        dbService: IDbService<any, any>;
        _id: ObjectId;
        dbServiceAccessOptions: DbServiceAccessOptions;
    }) => Promise<any>;
    getOverrideDbServiceAccessOptions: () => DbServiceAccessOptions;
    getSelfDbServiceAccessOptions: () => DbServiceAccessOptions;
    private _clearCacheDependents;
    private _getCacheDependents;
    findById: (props: DbServiceFindByIdParams) => Promise<DbServiceResponse>;
    find: (props: DbServiceFindParams) => Promise<DbServiceResponse[]>;
    countDocuments: (props: DbServiceFindOneParams) => Promise<number>;
    insert: (props: DbServiceInsertParams) => Promise<DbServiceResponse>;
    insertMany: (props: DbServiceInsertManyParams) => Promise<DbServiceResponse[]>;
    findOneAndUpdate: (props: DbServiceUpdateParams) => Promise<DbServiceResponse>;
    private _clearCacheBrancher;
    updateMany: (props: DbServiceUpdateParams) => Promise<DbServiceResponse[]>;
    findByIdAndDelete: (props: DbServiceFindByIdParams) => Promise<DbServiceResponse>;
    findOneAndDelete: (props: DbServiceFindOneParams) => Promise<DbServiceResponse>;
    startSession: () => Promise<ClientSession>;
    init: (initParams: DbServiceInitParams<OptionalDbServiceInitParams>) => Promise<this>;
    protected _initTemplate: (optionalDbServiceInitParams: Omit<DbServiceInitParams<OptionalDbServiceInitParams>, 'mongoose' | 'cloneDeep' | 'dbModel' | 'makeCacheDbService'>) => Promise<void>;
    getDbServiceModelViews: () => DbServiceModelViews;
}
export { AbstractDbService };
