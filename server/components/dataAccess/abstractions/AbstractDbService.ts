import { ObjectId } from 'mongoose';
import { CacheDbService, TTL_MS } from '../services/cache/cacheDbService';
import {
  DbServiceAccessOptions,
  DbServiceModelViews,
  IDbService,
  DbServiceInitParams,
  DB_SERVICE_JOIN_TYPE,
  DB_SERVICE_MODEL_VIEW,
  DB_SERVICE_CACHE_CLIENT,
} from './IDbService';

abstract class AbstractDbService<OptionalDbServiceInitParams, DbDoc>
  implements IDbService<OptionalDbServiceInitParams, DbDoc>
{
  protected _dbModel!: any;
  protected _dbModelName!: string;
  protected _dbServiceModelViews!: DbServiceModelViews;
  protected _cloneDeep!: any;
  protected _joinType: string = DB_SERVICE_JOIN_TYPE.NONE;
  protected _cacheDbService!: CacheDbService;

  public findOne = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const { modelView, modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const cacheKey = this._getCacheKey({
      searchQuery,
      modelViewName,
      cacheClient: DB_SERVICE_CACHE_CLIENT.FIND_ONE,
    });
    const cacheData = await this._cacheDbService.get(cacheKey);
    const dbQueryPromise = this._dbModel.findOne(searchQuery, modelView).lean();
    const storedData = await this._handleStoredData({
      cacheKey,
      cacheData,
      dbQueryPromise,
      dbServiceAccessOptions,
    });
    return storedData;
  };

  protected _getDbServiceModelView = (
    dbServiceAccessOptions: DbServiceAccessOptions
  ): { modelView: {}; modelViewName: string } => {
    const { isSelf, currentAPIUserRole, isOverrideView } = dbServiceAccessOptions || {};
    const { defaultView, selfView, adminView, overrideView } = this._dbServiceModelViews;
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
    searchQuery?: {};
  }): Promise<any> => {
    const { dbServiceAccessOptions, dbQueryPromise } = props;
    let dbQueryResult = await this._executeQuery({ dbServiceAccessOptions, dbQueryPromise });
    const hasLeftOuterJoin = this._joinType == DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
    const isResultArray = Array.isArray(dbQueryResult);
    const foreignKeyMapping = this._getForeignKeyObj();
    if (hasLeftOuterJoin && isResultArray) {
      const mappedQueryResult = dbQueryResult.map(async (dbDoc: StringKeyObject) => {
        return await this._joinDbDoc({ dbDoc, foreignKeyMapping });
      });
      dbQueryResult = await Promise.all(mappedQueryResult);
    } else if (hasLeftOuterJoin && !isResultArray) {
      dbQueryResult = await this._joinDbDoc({ dbDoc: dbQueryResult, foreignKeyMapping });
    }
    return dbQueryResult;
  };

  private _executeQuery = async (props: {
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbQueryPromise: Promise<any>;
  }): Promise<any> => {
    const { dbServiceAccessOptions, dbQueryPromise } = props;
    const { isProtectedResource, isCurrentAPIUserPermitted } = dbServiceAccessOptions;
    const isAccessPermitted =
      (isProtectedResource && isCurrentAPIUserPermitted) || !isProtectedResource;
    if (!isAccessPermitted) {
      throw new Error('Access denied.');
    }
    const dbQueryResult = await dbQueryPromise;
    return dbQueryResult;
  };

  protected _getForeignKeyObj = (): {} => {
    return {};
  };

  protected _joinDbDoc = async (props: {
    dbDoc: StringKeyObject;
    foreignKeyMapping: StringKeyObject;
  }): Promise<StringKeyObject> => {
    const { dbDoc, foreignKeyMapping } = props;
    const dbDocCopy: StringKeyObject = this._cloneDeep(dbDoc);
    if (dbDocCopy) {
      for (const joinProperty in foreignKeyMapping) {
        const foreignKeyData = foreignKeyMapping[joinProperty];
        const { foreignKeyName, ...otherForeignKeyData } = foreignKeyData;
        const props = { _id: dbDocCopy[foreignKeyName], ...otherForeignKeyData };
        dbDocCopy[joinProperty] = await this._getDbDataById(props);
      }
    }
    return dbDocCopy;
  };

  private _getDbDataById = async (props: {
    dbService: IDbService<any, any>;
    _id: ObjectId;
  }): Promise<any> => {
    const { dbService, _id } = props;
    const dbServiceAccessOptions = this._getBaseDbServiceAccessOptions();
    const dbData = await dbService.findById({ _id, dbServiceAccessOptions });
    return dbData;
  };

  private _getBaseDbServiceAccessOptions = () => {
    const dbServiceAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    };
    return dbServiceAccessOptions;
  };

  protected _getCacheKey = (props: {
    searchQuery?: {};
    modelViewName: string;
    cacheClient: string;
  }): string => {
    const { searchQuery, modelViewName, cacheClient } = props;
    return `${this._dbModelName}-${cacheClient}-${JSON.stringify(searchQuery)}-${modelViewName}`;
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
      await this._cacheDbService.set({ key: cacheKey, value: dbQueryResult, ttlMs: TTL_MS.WEEK });
      return dbQueryResult;
    }
  };

  private _replaceCacheKey = async (props: {
    searchQuery?: {};
    dbQueryResult: any;
  }): Promise<void> => {
    const { searchQuery, dbQueryResult } = props;
    for (const cacheClient in DB_SERVICE_CACHE_CLIENT) {
      for (const modelViewName in DB_SERVICE_MODEL_VIEW) {
        const keyToUpdate = this._getCacheKey({ searchQuery, modelViewName, cacheClient });
        await this._cacheDbService.set({
          key: keyToUpdate,
          value: dbQueryResult,
          ttlMs: TTL_MS.WEEK,
        });
      }
    }
  };

  public findById = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const { modelView, modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const cacheKey = this._getCacheKey({
      searchQuery: { _id },
      modelViewName,
      cacheClient: DB_SERVICE_CACHE_CLIENT.FIND_BY_ID,
    });
    const cacheData = await this._cacheDbService.get(cacheKey);
    const dbQueryPromise = this._dbModel.findById(_id, modelView).lean();
    const storedData = await this._handleStoredData({
      cacheKey,
      cacheData,
      dbQueryPromise,
      dbServiceAccessOptions,
    });
    return storedData;
  };

  public find = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const { modelView, modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const cacheKey = this._getCacheKey({
      searchQuery,
      modelViewName,
      cacheClient: DB_SERVICE_CACHE_CLIENT.FIND,
    });
    const cacheData = await this._cacheDbService.get(cacheKey);
    const dbQueryPromise = this._dbModel.find(searchQuery, modelView).lean();
    const storedData = await this._handleStoredData({
      cacheKey,
      cacheData,
      dbQueryPromise,
      dbServiceAccessOptions,
    });
    return storedData;
  };

  public insert = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const insertedModel = await this._dbModel.create(modelToInsert);
    // return findById result rather than insertedModel to ensure caller gets correct select modelView
    const dbQueryResult = await this.findById({ _id: insertedModel._id, dbServiceAccessOptions });
    return dbQueryResult;
  };

  public insertMany = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.insertMany(modelToInsert, modelView, {
      lean: true,
    });
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    return dbQueryResult;
  };

  public findOneAndUpdate = async (dbServiceParams: {
    searchQuery?: {};
    updateQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions } = dbServiceParams;
    const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel
      .findOneAndUpdate(searchQuery, updateQuery, {
        fields: modelView,
        new: true,
      })
      .lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._replaceCacheKey({ searchQuery, dbQueryResult });
    return dbQueryResult;
  };

  public updateMany = async (dbServiceParams: {
    searchQuery?: {};
    updateQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions } = dbServiceParams;
    const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel
      .updateMany(searchQuery, updateQuery, {
        fields: modelView,
        new: true,
      })
      .lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._replaceCacheKey({ searchQuery, dbQueryResult });
    return dbQueryResult;
  };

  public findByIdAndDelete = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const dbQueryPromise = this._dbModel.findByIdAndDelete(_id).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._replaceCacheKey({ searchQuery: { _id }, dbQueryResult });
    return dbQueryResult;
  };

  public findOneAndDelete = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const dbQueryPromise = this._dbModel.findOneAndDelete(searchQuery).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    await this._replaceCacheKey({ searchQuery, dbQueryResult });
    return dbQueryResult;
  };

  public init = async (
    initParams: DbServiceInitParams<OptionalDbServiceInitParams>
  ): Promise<this> => {
    const { makeDb, cloneDeep, dbModel, makeCacheDbService, ...optionalDbServiceInitParams } =
      initParams;
    await makeDb();
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
  ): Promise<void> => {};

  public getDbServiceModelViews = (): DbServiceModelViews => {
    const dbModelViewsCopy = this._cloneDeep(this._dbServiceModelViews);
    return dbModelViewsCopy;
  };
}

export { AbstractDbService };
