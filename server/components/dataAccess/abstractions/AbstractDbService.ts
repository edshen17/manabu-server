import { ExtractDoc } from 'ts-mongoose';
import {
  DbServiceAccessOptions,
  DbModelViews,
  IDbService,
  UPDATE_DB_DEPENDENCY_MODE,
} from './IDbService';

abstract class AbstractDbService<OptionalDbServiceInitParams, DbDoc extends HasId>
  implements IDbService<OptionalDbServiceInitParams, DbDoc>
{
  protected _dbModel!: any;
  protected _dbModelViews!: DbModelViews;
  protected _cloneDeep!: any;
  protected _updateDbDependencyMode?: string;

  public findOne = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const selectView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.findOne(searchQuery, selectView).lean();
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  protected _getDbModelView = (dbServiceAccessOptions: DbServiceAccessOptions): {} => {
    const { isSelf, currentAPIUserRole, isOverrideView } = dbServiceAccessOptions || {};
    const { defaultView, selfView, adminView, overrideView } = this._dbModelViews;
    const isAdmin = currentAPIUserRole == 'admin';
    let dbModelView: any = defaultView;

    if (isSelf) {
      dbModelView = selfView;
    }

    if (isAdmin) {
      dbModelView = adminView;
    }

    if (isOverrideView) {
      dbModelView = overrideView;
    }
    return dbModelView || defaultView;
  };

  protected _dbQueryReturnTemplate = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    dbQueryPromise: any
  ): Promise<any> => {
    const dbQueryResult = await this._executeQuery(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  protected _executeQuery = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    dbQueryPromise: Promise<any>
  ): Promise<any | Error> => {
    try {
      let dbQueryResult;
      const { isProtectedResource, isCurrentAPIUserPermitted } = dbServiceAccessOptions;
      const isAccessPermitted =
        (isProtectedResource && isCurrentAPIUserPermitted) || !isProtectedResource;

      if (isAccessPermitted) {
        dbQueryResult = await dbQueryPromise;
        return dbQueryResult;
      } else {
        throw new Error('Access denied.');
      }
    } catch (err) {
      throw err;
    }
  };

  public findById = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const selectView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.findById(_id, selectView).lean();
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public find = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const selectView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.find(searchQuery, selectView).lean();
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public insert = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const selectView = this._getDbModelView(dbServiceAccessOptions);
    const insertedModel = await this._dbModel.create(modelToInsert);
    // return findById result rather than insertedModel to ensure caller gets correct select view
    const dbQueryPromise = await this._dbModel.findById(insertedModel._id, selectView).lean();
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public insertMany = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const selectView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = await this._dbModel.insertMany(modelToInsert, selectView, {
      lean: true,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public findOneAndUpdate = async (dbServiceParams: {
    searchQuery?: {};
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    isUpdatingDbDependencies?: boolean;
  }): Promise<DbDoc> => {
    const { searchQuery, updateParams, dbServiceAccessOptions, isUpdatingDbDependencies } =
      dbServiceParams;
    const selectView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel
      .findOneAndUpdate(searchQuery, updateParams, {
        fields: selectView,
        new: true,
      })
      .lean();
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    if (dbQueryResult && isUpdatingDbDependencies) {
      await this.updateDbDependencies(dbQueryResult);
    }
    return dbQueryResult;
  };

  public updateDbDependencies = async (
    dbQueryResult: ExtractDoc<any> | ExtractDoc<any>[]
  ): Promise<void> => {
    const isUpdatingSync = process.env.NODE_ENV != 'production';
    const isUpdatingAsync = process.env.NODE_ENV == 'production';
    if (isUpdatingSync) {
      await this._updateDbDependencyController(dbQueryResult);
    } else if (isUpdatingAsync) {
      this._updateDbDependencyController(dbQueryResult);
    }
  };

  private _updateDbDependencyController = async (dbQueryResult: DbDoc | DbDoc[]) => {
    const isShallowUpdate = this._updateDbDependencyMode == UPDATE_DB_DEPENDENCY_MODE.SHALLOW;
    const isDeepUpdate = this._updateDbDependencyMode == UPDATE_DB_DEPENDENCY_MODE.DEEP;
    const dbServiceAccessOptions = this._getBaseDbServiceAccessOptions();
    if (isShallowUpdate) {
      await this._updateShallowDbDependencies({
        dbQueryResult: <DbDoc>dbQueryResult,
        dbServiceAccessOptions,
      });
    } else if (isDeepUpdate) {
      await this._updateDeepDbDependencies({
        dbQueryResult: <DbDoc[]>dbQueryResult,
        dbServiceAccessOptions,
      });
    }
  };

  private _updateShallowDbDependencies = async (props: {
    dbQueryResult: DbDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { dbQueryResult, dbServiceAccessOptions } = props;
    const updatedDependencyData = await this.findById({
      _id: dbQueryResult._id,
      dbServiceAccessOptions,
    });
    await this._updateShallowDbDependenciesTemplate({
      updatedDependencyData,
      dbServiceAccessOptions,
    });
  };

  protected _updateShallowDbDependenciesTemplate = async (props: {
    updatedDependencyData: DbDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {};

  private _updateDeepDbDependencies = async (props: {
    dbQueryResult: DbDoc[];
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const updateDependencyPromises = await this._updateDeepDbDependenciesTemplate(props);
    await Promise.all(updateDependencyPromises);
  };

  protected _updateDeepDbDependenciesTemplate = async (props: {
    dbQueryResult: DbDoc[];
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<Promise<any>[]> => {
    return new Promise(() => {});
  };

  protected _getBaseDbServiceAccessOptions = () => {
    const dbServiceAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    };
    return dbServiceAccessOptions;
  };

  public updateMany = async (dbServiceParams: {
    searchQuery?: {};
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    isUpdatingDbDependencies?: boolean;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateParams, dbServiceAccessOptions, isUpdatingDbDependencies } =
      dbServiceParams;
    const selectView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel
      .updateMany(searchQuery, updateParams, {
        fields: selectView,
        new: true,
      })
      .lean();
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    if (dbQueryResult && isUpdatingDbDependencies) {
      await this.updateDbDependencies(dbQueryResult);
    }
    return dbQueryResult;
  };

  public findByIdAndDelete = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const dbQueryPromise = this._dbModel.findByIdAndDelete(_id).lean();
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public init = async (
    initParams: {
      makeDb: () => Promise<any>;
      cloneDeep: any;
      dbModel: any;
    } & OptionalDbServiceInitParams
  ): Promise<this> => {
    const { makeDb, cloneDeep, dbModel, ...OptionalDbServiceInitParams } = initParams;
    await makeDb();
    this._cloneDeep = cloneDeep;
    this._dbModel = dbModel;
    await this._initTemplate(OptionalDbServiceInitParams);
    return this;
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: Omit<
      { makeDb: any; dbModel: any; cloneDeep: any } & OptionalDbServiceInitParams,
      'makeDb' | 'dbModel' | 'cloneDeep'
    >
  ): Promise<void> => {};

  public getDbModelViews = (): DbModelViews => {
    const dbModelViewsCopy = this._cloneDeep(this._dbModelViews);
    return dbModelViewsCopy;
  };
}

export { AbstractDbService };
