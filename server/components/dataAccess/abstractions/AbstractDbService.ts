import { ObjectId } from 'mongoose';
import {
  DbServiceAccessOptions,
  DbServiceModelViews,
  IDbService,
  DbServiceInitParams,
  DB_SERVICE_JOIN_TYPE,
  DB_SERVICE_MODEL_VIEWS,
} from './IDbService';
enum TTL_MS {
  WEEK = 24 * 60 * 60 * 7 * 1000,
}

abstract class AbstractDbService<OptionalDbServiceInitParams, DbDoc>
  implements IDbService<OptionalDbServiceInitParams, DbDoc>
{
  protected _dbModel!: any;
  protected _dbServiceModelViews!: DbServiceModelViews;
  protected _cloneDeep!: any;
  protected _joinType: string = DB_SERVICE_JOIN_TYPE.NONE;

  public findOne = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const { view, viewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const cacheKey = this._getCacheKey({ searchQuery, viewName });
    const dbQueryPromise = this._dbModel.findOne(searchQuery, view).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    return dbQueryResult;
  };

  protected _getDbServiceModelView = (
    dbServiceAccessOptions: DbServiceAccessOptions
  ): { view: {}; viewName: string } => {
    const { isSelf, currentAPIUserRole, isOverrideView } = dbServiceAccessOptions || {};
    const { defaultView, selfView, adminView, overrideView } = this._dbServiceModelViews;
    const isAdmin = currentAPIUserRole == 'admin';
    const dbServiceModelView: { view: {}; viewName: string } = {
      view: defaultView,
      viewName: DB_SERVICE_MODEL_VIEWS.DEFAULT,
    };
    if (isSelf) {
      dbServiceModelView.view = selfView;
      dbServiceModelView.viewName = DB_SERVICE_MODEL_VIEWS.SELF;
    }
    if (isAdmin) {
      dbServiceModelView.view = adminView;
      dbServiceModelView.viewName = DB_SERVICE_MODEL_VIEWS.ADMIN;
    }
    if (isOverrideView) {
      dbServiceModelView.view = overrideView;
      dbServiceModelView.viewName = DB_SERVICE_MODEL_VIEWS.OVERRIDE;
    }
    if (!dbServiceModelView.view) {
      dbServiceModelView.view = defaultView;
      dbServiceModelView.viewName = DB_SERVICE_MODEL_VIEWS.DEFAULT;
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

  private _getCacheKey = (props: { searchQuery?: {}; viewName: string }): string => {
    const { searchQuery, viewName } = props;
    return `${JSON.stringify(searchQuery)}-${viewName}`;
  };

  private _clearCacheKey = (props: { searchQuery?: {} }): void => {};

  public findById = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const { view, viewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const cacheKey = this._getCacheKey({ searchQuery: { _id }, viewName });
    const dbQueryPromise = this._dbModel.findById(_id, view).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    return dbQueryResult;
  };

  public find = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const { view, viewName } = this._getDbServiceModelView(dbServiceAccessOptions);
    const cacheKey = this._getCacheKey({ searchQuery, viewName });
    const dbQueryPromise = this._dbModel.find(searchQuery, view).lean();

    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    return dbQueryResult;
  };

  public insert = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const insertedModel = await this._dbModel.create(modelToInsert);
    // return findById result rather than insertedModel to ensure caller gets correct select view
    const dbQueryResult = this.findById({ _id: insertedModel._id, dbServiceAccessOptions });
    return dbQueryResult;
  };

  public insertMany = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const { view } = this._getDbServiceModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.insertMany(modelToInsert, view, {
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
    const { view } = this._getDbServiceModelView(dbServiceAccessOptions);
    this._clearCacheKey({ searchQuery });
    const dbQueryPromise = this._dbModel
      .findOneAndUpdate(searchQuery, updateQuery, {
        fields: view,
        new: true,
      })
      .lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    return dbQueryResult;
  };

  public updateMany = async (dbServiceParams: {
    searchQuery?: {};
    updateQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions } = dbServiceParams;
    const { view } = this._getDbServiceModelView(dbServiceAccessOptions);
    this._clearCacheKey({ searchQuery });
    const dbQueryPromise = this._dbModel
      .updateMany(searchQuery, updateQuery, {
        fields: view,
        new: true,
      })
      .lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    return dbQueryResult;
  };

  public findByIdAndDelete = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    this._clearCacheKey({ searchQuery: { _id } });
    const dbQueryPromise = this._dbModel.findByIdAndDelete(_id).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    return dbQueryResult;
  };

  public findOneAndDelete = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    this._clearCacheKey({ searchQuery });
    const dbQueryPromise = this._dbModel.findOneAndDelete(searchQuery).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    return dbQueryResult;
  };

  public init = async (
    initParams: DbServiceInitParams<OptionalDbServiceInitParams>
  ): Promise<this> => {
    const { makeDb, cloneDeep, dbModel, ...optionalDbServiceInitParams } = initParams;
    await makeDb();
    this._cloneDeep = cloneDeep;
    this._dbModel = dbModel;
    await this._initTemplate(optionalDbServiceInitParams);
    return this;
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: Omit<
      DbServiceInitParams<OptionalDbServiceInitParams>,
      'makeDb' | 'cloneDeep' | 'dbModel'
    >
  ): Promise<void> => {};

  public getDbServiceModelViews = (): DbServiceModelViews => {
    const dbModelViewsCopy = this._cloneDeep(this._dbServiceModelViews);
    return dbModelViewsCopy;
  };
}

export { AbstractDbService };
