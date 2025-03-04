import { ClientSession, Mongoose, ObjectId } from 'mongoose';
import { IS_PRODUCTION } from '../../../constants';
import { StringKeyObject } from '../../../types/custom';
import { CacheDbService, TTL_MS } from '../services/cache/cacheDbService';
import {
  CloneDeep,
  DbServiceAccessOptions,
  DbServiceFindByIdParams,
  DbServiceFindOneParams,
  DbServiceFindParams,
  DbServiceInitParams,
  DbServiceInsertManyParams,
  DbServiceInsertParams,
  DbServiceModelViews,
  DbServiceUpdateParams,
  DB_SERVICE_CACHE_CLIENT,
  DB_SERVICE_COLLECTION,
  DB_SERVICE_JOIN_TYPE,
  DB_SERVICE_MODEL_VIEW,
  IDbService,
} from './IDbService';

abstract class AbstractDbService<OptionalDbServiceInitParams, DbServiceResponse>
  implements IDbService<OptionalDbServiceInitParams, DbServiceResponse>
{
  protected _dbModel!: any;
  protected _dbModelName!: string;
  protected _cloneDeep!: CloneDeep;
  protected _joinType: string = DB_SERVICE_JOIN_TYPE.NONE;
  protected _ttlMs: number = TTL_MS.HOUR;
  protected _cacheDbService!: CacheDbService;
  protected _mongoose!: Mongoose;

  protected _getDbServiceModelViews = (): DbServiceModelViews => {
    return {
      defaultView: {},
      adminView: {},
      selfView: {},
      overrideView: {},
    };
  };

  public findOne = async (props: DbServiceFindOneParams): Promise<DbServiceResponse> => {
    const { searchQuery, dbServiceAccessOptions, session } = props;
    const { modelView, modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const cacheKey = this._getCacheKey({
      searchQuery,
      modelViewName,
      cacheClient: DB_SERVICE_CACHE_CLIENT.FIND_ONE,
    });
    this._testAccessPermitted(dbServiceAccessOptions);
    const cacheData = await this._getCacheData(cacheKey);
    const dbQueryPromise = this._dbModel.findOne(searchQuery, modelView).session(session).lean();
    const storedData = await this._handleStoredData({
      cacheKey,
      cacheData,
      dbQueryPromise,
      dbServiceAccessOptions,
    });
    return storedData;
  };

  private _getDbServiceModelView = (
    dbServiceAccessOptions: DbServiceAccessOptions
  ): { modelView: {}; modelViewName: string } => {
    const { isSelf, currentAPIUserRole, isOverrideView } = dbServiceAccessOptions || {};
    const { defaultView, selfView, adminView, overrideView } = this._getDbServiceModelViews();
    const isAdmin = currentAPIUserRole == 'admin';
    const dbServiceModelView: { modelView: {}; modelViewName: string } = {
      modelView: defaultView,
      modelViewName: DB_SERVICE_MODEL_VIEW.DEFAULT,
    };
    if (isSelf) {
      dbServiceModelView.modelView = selfView;
      dbServiceModelView.modelViewName = DB_SERVICE_MODEL_VIEW.SELF;
    }
    if (isAdmin) {
      dbServiceModelView.modelView = adminView;
      dbServiceModelView.modelViewName = DB_SERVICE_MODEL_VIEW.ADMIN;
    }
    if (isOverrideView) {
      dbServiceModelView.modelView = overrideView;
      dbServiceModelView.modelViewName = DB_SERVICE_MODEL_VIEW.OVERRIDE;
    }
    if (!dbServiceModelView.modelView) {
      dbServiceModelView.modelView = defaultView;
      dbServiceModelView.modelViewName = DB_SERVICE_MODEL_VIEW.DEFAULT;
    }
    return dbServiceModelView;
  };

  protected _getCacheKey = (props: {
    searchQuery?: StringKeyObject;
    modelViewName: string;
    cacheClient: string;
  }): string => {
    const { searchQuery, modelViewName, cacheClient } = props;
    return `${this._dbModelName}-${cacheClient}-${JSON.stringify(searchQuery)}-${modelViewName}`;
  };

  private _testAccessPermitted = (dbServiceAccessOptions: DbServiceAccessOptions) => {
    const { isCurrentAPIUserPermitted } = dbServiceAccessOptions;
    if (!isCurrentAPIUserPermitted) {
      throw new Error('Access denied.');
    }
  };

  private _getCacheData = async (cacheKey: string): Promise<any> => {
    const cacheData = await this._cacheDbService.get({ hashKey: this._dbModelName, key: cacheKey });
    return cacheData;
  };

  private _handleStoredData = async (props: {
    cacheKey: string;
    cacheData: any;
    dbQueryPromise: Promise<any>;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<any> => {
    const { cacheKey, cacheData, dbQueryPromise, dbServiceAccessOptions } = props;
    if (cacheData) {
      return cacheData;
    } else {
      const dbQueryResult = await this._getDbQueryResult({
        dbServiceAccessOptions,
        dbQueryPromise,
      });
      await this._setCacheData({ hashKey: this._dbModelName, cacheKey, dbQueryResult });
      return dbQueryResult;
    }
  };

  protected _getDbQueryResult = async (props: {
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbQueryPromise: any;
    searchQuery?: StringKeyObject;
  }): Promise<any> => {
    const { dbServiceAccessOptions, dbQueryPromise } = props;
    let dbQueryResult = await this._executeQuery({ dbQueryPromise });
    const hasJoin = this._joinType != DB_SERVICE_JOIN_TYPE.NONE;
    const isResultArray = Array.isArray(dbQueryResult);
    const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
    if (hasJoin && isResultArray) {
      const mappedQueryResult = dbQueryResult.map(async (dbDoc: any) => {
        return await this._joinDbDoc({ dbDoc, modelView });
      });
      dbQueryResult = await Promise.all(mappedQueryResult);
    } else if (hasJoin && !isResultArray) {
      dbQueryResult = await this._joinDbDoc({ dbDoc: dbQueryResult, modelView });
    }
    return dbQueryResult;
  };

  private _executeQuery = async (props: { dbQueryPromise: Promise<any> }): Promise<any> => {
    const { dbQueryPromise } = props;
    const dbQueryResult = await dbQueryPromise.then((doc) => {
      return doc;
    });
    return dbQueryResult;
  };

  private _joinDbDoc = async (props: {
    dbDoc: any;
    modelView: StringKeyObject;
  }): Promise<StringKeyObject> => {
    const { dbDoc, modelView } = props;
    const dbDocCopy: StringKeyObject = this._cloneDeep(dbDoc);
    if (dbDocCopy) {
      const dbServiceAccessOptions = this.getBaseDbServiceAccessOptions();
      const computedProps = await this._getComputedProps({
        dbDoc: dbDocCopy,
        dbServiceAccessOptions,
      });
      for (const computedProp in computedProps) {
        const foreignKeyIdName = computedProp.replace(/Data/i, 'Id');
        const isRestrictedProp = modelView[foreignKeyIdName] == 0;
        if (!isRestrictedProp) {
          const computedData = computedProps[computedProp];
          dbDocCopy[computedProp] = computedData;
        }
      }
    }
    return dbDocCopy;
  };

  public getBaseDbServiceAccessOptions = (): DbServiceAccessOptions => {
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    };
    return dbServiceAccessOptions;
  };

  protected _getComputedProps = async (props: {
    dbDoc: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<StringKeyObject> => {
    return {};
  };

  private _setCacheData = async (props: {
    hashKey: string;
    cacheKey: string;
    dbQueryResult: any;
  }): Promise<void> => {
    const { hashKey, cacheKey, dbQueryResult } = props;
    await this._cacheDbService.set({
      hashKey,
      key: cacheKey,
      value: dbQueryResult,
      ttlMs: this._ttlMs,
    });
  };

  protected _getDbDataById = async (props: {
    dbService: IDbService<any, any>;
    _id: ObjectId;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<any> => {
    const { dbService, _id, dbServiceAccessOptions } = props;
    const dbData = await dbService.findById({ _id, dbServiceAccessOptions });
    return dbData;
  };

  public getOverrideDbServiceAccessOptions = (): DbServiceAccessOptions => {
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
      isOverrideView: true,
    };
    return dbServiceAccessOptions;
  };

  public getSelfDbServiceAccessOptions = (): DbServiceAccessOptions => {
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: true,
      isOverrideView: false,
    };
    return dbServiceAccessOptions;
  };

  private _clearCacheDependents = async (collectionName: string): Promise<void> => {
    const cacheDependencies = this._getCacheDependents();
    const collectionDependents = cacheDependencies[collectionName];
    const seenCollections: string[] = [];
    const hasSeenCollection = !seenCollections.includes(collectionName);
    if (hasSeenCollection) {
      await this._cacheDbService.clearHashKey(collectionName);
      seenCollections.push(collectionName);
      for (const dependentCollectionName of collectionDependents) {
        this._clearCacheDependents(dependentCollectionName);
      }
    }
  };

  private _getCacheDependents = (): StringKeyObject => {
    const CACHE_DEPENDENTS = {
      [DB_SERVICE_COLLECTION.USERS]: [DB_SERVICE_COLLECTION.PACKAGE_TRANSACTIONS],
      [DB_SERVICE_COLLECTION.TEACHERS]: [DB_SERVICE_COLLECTION.USERS],
      [DB_SERVICE_COLLECTION.PACKAGES]: [
        DB_SERVICE_COLLECTION.TEACHERS,
        DB_SERVICE_COLLECTION.PACKAGE_TRANSACTIONS,
      ],
      [DB_SERVICE_COLLECTION.PACKAGE_TRANSACTIONS]: [
        DB_SERVICE_COLLECTION.APPOINTMENTS,
        DB_SERVICE_COLLECTION.BALANCE_TRANSACTIONS,
      ],
      [DB_SERVICE_COLLECTION.APPOINTMENTS]: [],
      [DB_SERVICE_COLLECTION.BALANCE_TRANSACTIONS]: [],
      [DB_SERVICE_COLLECTION.AVAILABLE_TIMES]: [],
      [DB_SERVICE_COLLECTION.INCOME_REPORTS]: [],
      [DB_SERVICE_COLLECTION.CONTENTS]: [],
    };
    return CACHE_DEPENDENTS;
  };

  public findById = async (props: DbServiceFindByIdParams): Promise<DbServiceResponse> => {
    const { _id, dbServiceAccessOptions, session } = props;
    const { modelView, modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const cacheKey = this._getCacheKey({
      searchQuery: { _id },
      modelViewName,
      cacheClient: DB_SERVICE_CACHE_CLIENT.FIND_BY_ID,
    });
    this._testAccessPermitted(dbServiceAccessOptions);
    const cacheData = await this._getCacheData(cacheKey);
    const dbQueryPromise = this._dbModel.findById(_id, modelView).session(session).lean();
    const storedData = await this._handleStoredData({
      cacheKey,
      cacheData,
      dbQueryPromise,
      dbServiceAccessOptions,
    });
    return storedData;
  };

  public find = async (props: DbServiceFindParams): Promise<DbServiceResponse[]> => {
    const { searchQuery, paginationOptions, dbServiceAccessOptions, session } = props;
    const { modelView, modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const { page, limit, sort } = paginationOptions || {
      page: 0,
      limit: 20,
      sort: {},
    };
    const cacheKey = this._getCacheKey({
      searchQuery: { ...searchQuery, paginationOptions },
      modelViewName,
      cacheClient: DB_SERVICE_CACHE_CLIENT.FIND,
    });
    this._testAccessPermitted(dbServiceAccessOptions);
    const cacheData = await this._getCacheData(cacheKey);
    const dbQueryPromise = this._dbModel
      .find(searchQuery, modelView)
      .skip(page * limit)
      .limit(limit)
      .session(session)
      .sort(sort)
      .lean();
    const storedData = await this._handleStoredData({
      cacheKey,
      cacheData,
      dbQueryPromise,
      dbServiceAccessOptions,
    });
    return storedData;
  };

  public countDocuments = async (props: DbServiceFindOneParams): Promise<number> => {
    const { searchQuery, dbServiceAccessOptions, session } = props;
    const { modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const cacheKey = this._getCacheKey({
      searchQuery,
      modelViewName,
      cacheClient: DB_SERVICE_CACHE_CLIENT.FIND,
    });
    this._testAccessPermitted(dbServiceAccessOptions);
    const cacheData = await this._getCacheData(cacheKey);
    const dbQueryPromise = this._dbModel.countDocuments(searchQuery).session(session);
    const storedData = await this._handleStoredData({
      cacheKey,
      cacheData,
      dbQueryPromise,
      dbServiceAccessOptions,
    });
    return storedData;
  };

  public insert = async (props: DbServiceInsertParams): Promise<DbServiceResponse> => {
    const { modelToInsert, dbServiceAccessOptions, session, preserveCache } = props;
    this._testAccessPermitted(dbServiceAccessOptions);
    let dbQueryResult: DbServiceResponse;
    if (!session) {
      const insertedModel = await this._dbModel.create(modelToInsert).then((doc: any) => {
        return doc.toObject(); // lean
      });
      // return findById result rather than insertedModel to ensure caller gets correct modelView/joined document
      dbQueryResult = await this.findById({ _id: insertedModel._id, dbServiceAccessOptions });
    } else {
      const insertedModel = await this.insertMany({
        modelToInsert: [modelToInsert],
        dbServiceAccessOptions,
        session,
      });
      dbQueryResult = await this.findById({
        _id: (insertedModel[0] as any)._id,
        dbServiceAccessOptions,
      });
    }
    await this._clearCacheBrancher(preserveCache);
    return dbQueryResult;
  };

  public insertMany = async (props: DbServiceInsertManyParams): Promise<DbServiceResponse[]> => {
    const { modelToInsert, dbServiceAccessOptions, session, preserveCache } = props;
    const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
    this._testAccessPermitted(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.insertMany(modelToInsert, modelView, {
      lean: true,
      session,
    });
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._clearCacheBrancher(preserveCache);
    return dbQueryResult;
  };

  public findOneAndUpdate = async (props: DbServiceUpdateParams): Promise<DbServiceResponse> => {
    const {
      searchQuery,
      updateQuery,
      dbServiceAccessOptions,
      session,
      queryOptions,
      preserveCache,
    } = props;
    const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
    this._testAccessPermitted(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel
      .findOneAndUpdate(
        searchQuery,
        { ...updateQuery, lastModifiedDate: new Date() },
        {
          fields: modelView,
          new: true,
          ...queryOptions,
        }
      )
      .session(session)
      .lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._clearCacheBrancher(preserveCache);
    return dbQueryResult;
  };

  private _clearCacheBrancher = async (preserveCache?: boolean): Promise<void> => {
    if (!this._dbModelName || preserveCache) {
      return;
    }
    if (!IS_PRODUCTION) {
      await this._clearCacheDependents(this._dbModelName);
    } else {
      this._clearCacheDependents(this._dbModelName);
    }
  };

  public updateMany = async (props: DbServiceUpdateParams): Promise<DbServiceResponse[]> => {
    const {
      searchQuery,
      updateQuery,
      dbServiceAccessOptions,
      queryOptions,
      session,
      preserveCache,
    } = props;
    const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
    this._testAccessPermitted(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel
      .updateMany(
        searchQuery,
        { ...updateQuery, lastModifiedDate: new Date() },
        {
          fields: modelView,
          new: true,
          ...queryOptions,
        }
      )
      .session(session)
      .lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._clearCacheBrancher(preserveCache);
    return dbQueryResult;
  };

  public findByIdAndDelete = async (props: DbServiceFindByIdParams): Promise<DbServiceResponse> => {
    const { _id, dbServiceAccessOptions, session, preserveCache } = props;
    this._testAccessPermitted(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.findByIdAndDelete(_id).session(session).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._clearCacheBrancher(preserveCache);
    return dbQueryResult;
  };

  public findOneAndDelete = async (props: DbServiceFindOneParams): Promise<DbServiceResponse> => {
    const { searchQuery, dbServiceAccessOptions, session, preserveCache } = props;
    this._testAccessPermitted(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.findOneAndDelete(searchQuery).session(session).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._clearCacheBrancher(preserveCache);
    return dbQueryResult;
  };

  public startSession = async (): Promise<ClientSession> => {
    const session = await this._mongoose.startSession();
    return session;
  };

  public init = async (
    initParams: DbServiceInitParams<OptionalDbServiceInitParams>
  ): Promise<this> => {
    const { mongoose, cloneDeep, dbModel, makeCacheDbService, ...optionalDbServiceInitParams } =
      initParams;
    this._mongoose = mongoose;
    this._cloneDeep = cloneDeep;
    this._dbModel = dbModel;
    this._dbModelName = this._dbModel ? this._dbModel.collection.collectionName : '';
    this._cacheDbService = await makeCacheDbService;
    await this._initTemplate(optionalDbServiceInitParams);
    return this;
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: Omit<
      DbServiceInitParams<OptionalDbServiceInitParams>,
      'mongoose' | 'cloneDeep' | 'dbModel' | 'makeCacheDbService'
    >
  ): Promise<void> => {
    return;
  };

  public getDbServiceModelViews = (): DbServiceModelViews => {
    const dbServiceModelViews = this._getDbServiceModelViews();
    const dbModelViewsCopy = this._cloneDeep(dbServiceModelViews);
    return dbModelViewsCopy;
  };
}

export { AbstractDbService };
