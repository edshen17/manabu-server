import { DbServiceAccessOptions, DbModelViews, IDbService } from './IDbService';

abstract class AbstractDbService<OptionalDbServiceInitParams, DbDoc>
  implements IDbService<OptionalDbServiceInitParams, DbDoc>
{
  protected _dbModel!: any;
  protected _dbModelViews!: DbModelViews;
  protected _cloneDeep!: any;

  public findOne = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const selectView = this._getSelectView(dbServiceAccessOptions);
    const dbDataPromise = this._dbModel.findOne(searchQuery, selectView).lean();
    const dbData = await this._dbDataReturnTemplate(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };

  protected _getSelectView = (dbServiceAccessOptions: DbServiceAccessOptions): {} => {
    const { isSelf, currentAPIUserRole, isOverrideView } = dbServiceAccessOptions || {};
    const { defaultView, selfView, adminView, overrideView } = this._dbModelViews;
    let selectView: any = defaultView;

    if (isSelf) {
      selectView = selfView;
    }

    if (currentAPIUserRole == 'admin') {
      selectView = adminView;
    }

    if (isOverrideView) {
      selectView = overrideView;
    }
    return selectView || defaultView;
  };

  protected _dbDataReturnTemplate = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    dbDataPromise: any
  ): Promise<any> => {
    const dbData = await this._grantAccess(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };

  protected _grantAccess = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    dbDataPromise: Promise<any>
  ): Promise<any | Error> => {
    try {
      let dbData;
      const { isProtectedResource, isCurrentAPIUserPermitted } = dbServiceAccessOptions;
      const isAccessPermitted =
        (isProtectedResource && isCurrentAPIUserPermitted) || !isProtectedResource;

      if (isAccessPermitted) {
        dbData = await dbDataPromise;
        return dbData;
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
    const selectView = this._getSelectView(dbServiceAccessOptions);
    const dbDataPromise = this._dbModel.findById(_id, selectView).lean();
    const dbData = await this._dbDataReturnTemplate(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };

  public find = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const selectView = this._getSelectView(dbServiceAccessOptions);
    const dbDataPromise = this._dbModel.find(searchQuery, selectView).lean();
    const dbData = await this._dbDataReturnTemplate(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };

  public insert = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const selectView = this._getSelectView(dbServiceAccessOptions);
    const insertedModel = await this._dbModel.create(modelToInsert);
    // return findById result rather than insertedModel to ensure caller gets correct select view
    const dbDataPromise = await this._dbModel.findById(insertedModel._id, selectView).lean();
    const dbData = await this._dbDataReturnTemplate(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };

  public insertMany = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const selectView = this._getSelectView(dbServiceAccessOptions);
    const dbDataPromise = await this._dbModel.insertMany(modelToInsert, selectView, {
      lean: true,
    });
    const dbData = await this._dbDataReturnTemplate(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };

  public findOneAndUpdate = async (dbServiceParams: {
    searchQuery?: {};
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    updateDbDependencies?: boolean;
  }): Promise<DbDoc> => {
    const { searchQuery, updateParams, dbServiceAccessOptions, updateDbDependencies } =
      dbServiceParams;
    const selectView = this._getSelectView(dbServiceAccessOptions);
    const dbDataPromise = this._dbModel
      .findOneAndUpdate(searchQuery, updateParams, {
        fields: selectView,
        new: true,
      })
      .lean();
    const dbData = await this._dbDataReturnTemplate(dbServiceAccessOptions, dbDataPromise);
    if (updateDbDependencies) {
      await this.updateManyDbDependencies(dbData);
    }
    return dbData;
  };

  public updateManyDbDependencies = async (dbData?: any) => {};

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
    updateDbDependencies?: boolean;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateParams, dbServiceAccessOptions, updateDbDependencies } =
      dbServiceParams;
    const selectView = this._getSelectView(dbServiceAccessOptions);
    const dbDataPromise = this._dbModel
      .updateMany(searchQuery, updateParams, {
        fields: selectView,
        new: true,
      })
      .lean();
    const dbData = await this._dbDataReturnTemplate(dbServiceAccessOptions, dbDataPromise);
    if (updateDbDependencies) {
      await this.updateManyDbDependencies(dbData);
    }
    return dbData;
  };

  public findByIdAndDelete = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const dbDataPromise = this._dbModel.findByIdAndDelete(_id).lean();
    const dbData = await this._dbDataReturnTemplate(dbServiceAccessOptions, dbDataPromise);
    return dbData;
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
