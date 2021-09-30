import { ObjectId } from 'mongoose';
import { MakeDbResponse } from '..';
import { StringKeyObject } from '../../../types/custom';
import { CacheDbService, TTL_MS } from '../services/cache/cacheDbService';
import {
  DbServiceAccessOptions,
  DbServiceInitParams,
  DbServiceModelViews,
  DB_SERVICE_CACHE_CLIENT,
  DB_SERVICE_JOIN_TYPE,
  DB_SERVICE_MODEL_VIEW,
  IDbService,
  PaginationOptions,
} from './IDbService';

abstract class AbstractDbService<OptionalDbServiceInitParams, DbDoc>
  implements IDbService<OptionalDbServiceInitParams, DbDoc>
{
  protected _dbModel!: any;
  protected _dbModelName!: string;
  protected _cloneDeep!: any;
  protected _joinType: string = DB_SERVICE_JOIN_TYPE.NONE;
  protected _ttlMs: number = TTL_MS.WEEK;
  protected _cacheDbService!: CacheDbService;
  protected _makeDbResponse!: MakeDbResponse;

  protected _getDbServiceModelViews = (): DbServiceModelViews => {
    return {
      defaultView: {},
      adminView: {},
      selfView: {},
      overrideView: {},
    };
  };

  public findOne = async (props: {
    searchQuery?: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session?: StringKeyObject;
  }): Promise<DbDoc> => {
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

  private _testAccessPermitted = (dbServiceAccessOptions: DbServiceAccessOptions) => {
    const { isCurrentAPIUserPermitted } = dbServiceAccessOptions;
    if (!isCurrentAPIUserPermitted) {
      throw new Error('Access denied.');
    }
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

  protected _getComputedProps = async (props: {
    dbDoc: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<StringKeyObject> => {
    return {};
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

  protected _getDbDataById = async (props: {
    dbService: IDbService<any, any>;
    _id: ObjectId;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<any> => {
    const { dbService, _id, dbServiceAccessOptions } = props;
    const dbData = await dbService.findById({ _id, dbServiceAccessOptions });
    return dbData;
  };

  public getBaseDbServiceAccessOptions = (): DbServiceAccessOptions => {
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    };
    return dbServiceAccessOptions;
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

  protected _getCacheKey = (props: {
    searchQuery?: StringKeyObject;
    modelViewName: string;
    cacheClient: string;
  }): string => {
    const { searchQuery, modelViewName, cacheClient } = props;
    return `${this._dbModelName}-${cacheClient}-${JSON.stringify(searchQuery)}-${modelViewName}`;
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

  private _clearCacheBrancher = async (): Promise<void> => {
    const isAsync = process.env.NODE_ENV != 'production';
    if (isAsync) {
      await this._clearCacheDependencies();
    } else {
      this._clearCacheDependencies();
    }
  };

  private _clearCacheDependencies = async (): Promise<void> => {
    const cacheDependencies = this._getCacheDependencies();
    await this._cacheDbService.clearHashKey(this._dbModelName);
    for (const cacheDependency of cacheDependencies) {
      await this._cacheDbService.clearHashKey(cacheDependency);
    }
  };

  protected _getCacheDependencies = (): string[] => {
    return [];
  };

  public findById = async (props: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session?: StringKeyObject;
  }): Promise<DbDoc> => {
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

  public find = async (props: {
    searchQuery?: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
    paginationOptions?: PaginationOptions;
    session?: StringKeyObject;
  }): Promise<DbDoc[]> => {
    const { searchQuery, paginationOptions, dbServiceAccessOptions, session } = props;
    const { modelView, modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const { page, limit, sort } = paginationOptions || {
      page: 0,
      limit: 20,
      sort: {},
    };
    const cacheKey = this._getCacheKey({
      searchQuery,
      modelViewName,
      cacheClient: DB_SERVICE_CACHE_CLIENT.FIND,
    });
    this._testAccessPermitted(dbServiceAccessOptions);
    const cacheData = await this._getCacheData(cacheKey);
    const dbQueryPromise = this._dbModel
      .find(searchQuery, modelView)
      .sort(sort)
      .skip(page * limit)
      .limit(limit)
      .session(session)
      .lean();
    const storedData = await this._handleStoredData({
      cacheKey,
      cacheData,
      dbQueryPromise,
      dbServiceAccessOptions,
    });
    return storedData;
  };

  public insert = async (props: {
    modelToInsert?: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { modelToInsert, dbServiceAccessOptions } = props;
    this._testAccessPermitted(dbServiceAccessOptions);
    const insertedModel = await this._dbModel.create(modelToInsert).then((doc: any) => {
      return doc.toObject(); // lean
    });
    // return findById result rather than insertedModel to ensure caller gets correct select modelView
    const dbQueryResult = await this.findById({ _id: insertedModel._id, dbServiceAccessOptions });
    return dbQueryResult;
  };

  public insertMany = async (props: {
    modelToInsert?: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session?: StringKeyObject;
  }): Promise<DbDoc[]> => {
    const { modelToInsert, dbServiceAccessOptions, session } = props;
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
    return dbQueryResult;
  };

  public findOneAndUpdate = async (props: {
    searchQuery?: StringKeyObject;
    updateQuery?: StringKeyObject;
    queryOptions?: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session?: StringKeyObject;
  }): Promise<DbDoc> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions, session, queryOptions } = props;
    const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
    this._testAccessPermitted(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel
      .findOneAndUpdate(searchQuery, updateQuery, {
        fields: modelView,
        new: true,
        ...queryOptions,
      })
      .session(session)
      .lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._clearCacheBrancher();
    return dbQueryResult;
  };

  public updateMany = async (props: {
    searchQuery?: StringKeyObject;
    updateQuery?: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
    queryOptions?: StringKeyObject;
    session?: StringKeyObject;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions, queryOptions, session } = props;
    const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
    this._testAccessPermitted(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel
      .updateMany(searchQuery, updateQuery, {
        fields: modelView,
        new: true,
        ...queryOptions,
      })
      .session(session)
      .lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._clearCacheBrancher();
    return dbQueryResult;
  };

  public findByIdAndDelete = async (props: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session?: StringKeyObject;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions, session } = props;
    this._testAccessPermitted(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.findByIdAndDelete(_id).session(session).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._clearCacheBrancher();
    return dbQueryResult;
  };

  public findOneAndDelete = async (props: {
    searchQuery?: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session?: StringKeyObject;
  }): Promise<DbDoc> => {
    const { searchQuery, dbServiceAccessOptions, session } = props;
    this._testAccessPermitted(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.findOneAndDelete(searchQuery).session(session).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._clearCacheBrancher();
    return dbQueryResult;
  };

  public startSession = async (): Promise<any> => {
    const { dbURI, mongoDbOptions, mongoose } = this._makeDbResponse;
    const mongoDbOptionsCopy = this._cloneDeep(mongoDbOptions);
    mongoDbOptionsCopy.readPreference = 'primary';
    const db = await mongoose.createConnection(dbURI, mongoDbOptionsCopy);
    const session = await db.startSession();
    return session;
  };

  public init = async (
    initParams: DbServiceInitParams<OptionalDbServiceInitParams>
  ): Promise<this> => {
    const { makeDb, cloneDeep, dbModel, makeCacheDbService, ...optionalDbServiceInitParams } =
      initParams;
    this._makeDbResponse = await makeDb();
    this._cloneDeep = cloneDeep;
    this._dbModel = dbModel;
    this._dbModelName = this._dbModel.collection.collectionName;
    this._cacheDbService = await makeCacheDbService;
    await this._initTemplate(optionalDbServiceInitParams);
    return this;
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: Omit<
      DbServiceInitParams<OptionalDbServiceInitParams>,
      'makeDb' | 'cloneDeep' | 'dbModel' | 'makeCacheDbService'
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
