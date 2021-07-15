import {
  DbServiceAccessOptions,
  DbModelViews,
  IDbService,
  DbDependencyUpdateParams,
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
    const dbQueryPromise = this._dbModel.findById(insertedModel._id, selectView).lean();
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public insertMany = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const selectView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel.insertMany(modelToInsert, selectView, {
      lean: true,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public findOneAndUpdate = async (dbServiceParams: {
    searchQuery?: {};
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<DbDoc> => {
    const { searchQuery, updateParams, dbServiceAccessOptions, dbDependencyUpdateParams } =
      dbServiceParams;
    const selectView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel
      .findOneAndUpdate(searchQuery, updateParams, {
        fields: selectView,
        new: true,
      })
      .lean();
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    await this._updateDbDependenciesBranch({ dbDependencyUpdateParams });
    return dbQueryResult;
  };

  private _updateDbDependenciesBranch = async (props: {
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }) => {
    const { dbDependencyUpdateParams } = props;
    if (dbDependencyUpdateParams) {
      await this.updateDbDependencies(dbDependencyUpdateParams);
    }
  };

  public updateDbDependencies = async (
    dbDependencyUpdateParams: DbDependencyUpdateParams
  ): Promise<void> => {
    const isUpdatingSync = process.env.NODE_ENV != 'production';
    const isUpdatingAsync = process.env.NODE_ENV == 'production';
    if (isUpdatingSync) {
      await this._updateDbDependencyController(dbDependencyUpdateParams);
    } else if (isUpdatingAsync) {
      this._updateDbDependencyController(dbDependencyUpdateParams);
    }
  };

  private _updateDbDependencyController = async (
    dbDependencyUpdateParams: DbDependencyUpdateParams
  ): Promise<void> => {
    const { updatedDependentSearchQuery } = dbDependencyUpdateParams;
    const dbServiceAccessOptions = this._getBaseDbServiceAccessOptions();
    const updatedDependeeDocs = await this.find({
      searchQuery: updatedDependentSearchQuery,
      dbServiceAccessOptions,
    });
    const updateDependentPromises: Promise<any>[] = [];
    for (const updatedDependeeDoc of updatedDependeeDocs) {
      await this._updateDbDependencyControllerTemplate({
        updateDependentPromises,
        updatedDependeeDoc,
        dbServiceAccessOptions,
      });
    }
    await Promise.all(updateDependentPromises);
  };

  protected _updateDbDependencyControllerTemplate = async (props: {
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
    updateParams: {};
    updatedDependentSearchQuery?: {};
  }) => {
    const {
      dependencyDbService,
      dbServiceAccessOptions,
      searchQuery,
      updateParams,
      updatedDependentSearchQuery,
    } = props;
    const updateDependeePromise = dependencyDbService.updateMany({
      searchQuery,
      updateParams,
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
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateParams, dbServiceAccessOptions, dbDependencyUpdateParams } =
      dbServiceParams;
    const selectView = this._getDbModelView(dbServiceAccessOptions);
    const dbQueryPromise = this._dbModel
      .updateMany(searchQuery, updateParams, {
        fields: selectView,
        new: true,
      })
      .lean();
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    await this._updateDbDependenciesBranch({ dbDependencyUpdateParams });
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
