import {
  DbServiceAccessOptions,
  DbModelViews,
  IDbService,
  DbDependencyUpdateParams,
  DbServiceInitParams,
} from './IDbService';

abstract class AbstractDbService<OptionalDbServiceInitParams, DbDoc>
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
    const modelView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.findOne(searchQuery, modelView).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
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

  protected _getDbQueryResult = async (props: {
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbQueryPromise: any;
    searchQuery?: {};
  }): Promise<any> => {
    const { dbServiceAccessOptions, dbQueryPromise } = props;
    const dbQueryResult = await this._executeQuery(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  protected _executeQuery = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    dbQueryPromise: Promise<any>
  ): Promise<any | Error> => {
    let dbQueryResult;
    const { isProtectedResource, isCurrentAPIUserPermitted } = dbServiceAccessOptions;
    const isAccessPermitted =
      (isProtectedResource && isCurrentAPIUserPermitted) || !isProtectedResource;
    if (!isAccessPermitted) {
      throw new Error('Access denied.');
    }
    dbQueryResult = await dbQueryPromise;
    return dbQueryResult;
  };

  public findById = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const modelView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.findById(_id, modelView).lean();
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
    const modelView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.find(searchQuery, modelView).lean();
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
    const modelView = this._getDbModelView(dbServiceAccessOptions);
    const insertedModel = await this._dbModel.create(modelToInsert);
    // return findById result rather than insertedModel to ensure caller gets correct select view
    const dbQueryPromise = this._dbModel.findById(insertedModel._id, modelView).lean();
    const dbQueryResult = await this._getDbQueryResult({
      dbServiceAccessOptions,
      dbQueryPromise,
    });
    return dbQueryResult;
  };

  public insertMany = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const modelView = this._getDbModelView(dbServiceAccessOptions);
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
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<DbDoc> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions, dbDependencyUpdateParams } =
      dbServiceParams;
    const modelView = this._getDbModelView(dbServiceAccessOptions);
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
    await this._updateDbDependencyHandler({ dbDependencyUpdateParams });
    return dbQueryResult;
  };

  protected _updateDbDependencyHandler = async (props: {
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }) => {
    const { dbDependencyUpdateParams } = props;
    if (dbDependencyUpdateParams) {
      await this._updateDbDependencyBrancher(dbDependencyUpdateParams);
    }
  };

  private _updateDbDependencyBrancher = async (
    dbDependencyUpdateParams: DbDependencyUpdateParams
  ): Promise<void> => {
    const isProduction = process.env.NODE_ENV == 'production';
    if (isProduction) {
      this._updateDbDependencies(dbDependencyUpdateParams);
    } else {
      await this._updateDbDependencies(dbDependencyUpdateParams);
    }
  };

  protected _updateDbDependencies = async (
    dbDependencyUpdateParams: DbDependencyUpdateParams
  ): Promise<void> => {
    const dbServiceAccessOptions = this._getBaseDbServiceAccessOptions();
    const updatedDependeeDocs = await this._getUpdatedDependeeDocs({
      dbDependencyUpdateParams,
      dbServiceAccessOptions,
    });
    const updateDependentPromises: Promise<any>[] = [];
    for (const updatedDependeeDoc of updatedDependeeDocs) {
      await this._updateDbDependenciesTemplate({
        updateDependentPromises,
        updatedDependeeDoc,
        dbServiceAccessOptions,
      });
    }
    await Promise.all(updateDependentPromises);
  };

  protected _getUpdatedDependeeDocs = async (props: {
    dbDependencyUpdateParams: DbDependencyUpdateParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { dbDependencyUpdateParams, dbServiceAccessOptions } = props;
    const { updatedDependentSearchQuery } = dbDependencyUpdateParams;
    const updatedDependeeDocs = await this.find({
      searchQuery: updatedDependentSearchQuery,
      dbServiceAccessOptions,
    });
    return updatedDependeeDocs;
  };

  protected _updateDbDependenciesTemplate = async (props: {
    updateDependentPromises: Promise<any>[];
    updatedDependeeDoc: DbDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {};

  protected _getUpdateManyDependeePromises = async (props: {
    updatedDependeeDoc: DbDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    dependencyDbService: IDbService<any, any>;
  }): Promise<Promise<any>[]> => {
    return [];
  };

  protected _getUpdateManyDependeePromise = (props: {
    dbServiceAccessOptions: DbServiceAccessOptions;
    dependencyDbService: IDbService<any, any>;
    searchQuery: {};
    updateQuery: {};
    updatedDependentSearchQuery?: {};
  }) => {
    const {
      dependencyDbService,
      dbServiceAccessOptions,
      searchQuery,
      updateQuery,
      updatedDependentSearchQuery,
    } = props;
    const updateDependeePromise = dependencyDbService.updateMany({
      searchQuery,
      updateQuery,
      dbServiceAccessOptions,
      dbDependencyUpdateParams: {
        updatedDependentSearchQuery,
      },
    });
    return updateDependeePromise;
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
    updateQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions, dbDependencyUpdateParams } =
      dbServiceParams;
    const modelView = this._getDbModelView(dbServiceAccessOptions);
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
    await this._updateDbDependencyHandler({ dbDependencyUpdateParams });
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
    return dbQueryResult;
  };

  public init = async (
    initParams: DbServiceInitParams<OptionalDbServiceInitParams>
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
