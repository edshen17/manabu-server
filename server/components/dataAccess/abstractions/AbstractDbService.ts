import { DbServiceAccessOptions, DbServiceDefaultSelectOptions, IDbService } from './IDbService';

abstract class AbstractDbService<DbServiceInitParams, DbDoc>
  implements IDbService<DbServiceInitParams, DbDoc>
{
  protected _dbModel!: any;
  protected _cloneDeep!: any;
  protected _defaultSelectOptions!: DbServiceDefaultSelectOptions;

  public findOne = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const selectOptions = this._configureSelectOptions(dbServiceAccessOptions);
    const asyncCallback = this._dbModel.findOne(searchQuery, selectOptions).lean();
    return await this._dbReturnTemplate(dbServiceAccessOptions, asyncCallback);
  };

  protected _configureSelectOptions = (dbServiceAccessOptions: DbServiceAccessOptions): {} => {
    const { isSelf, currentAPIUserRole, isOverridingSelectOptions } = dbServiceAccessOptions || {};
    const { defaultSettings, adminSettings, isSelfSettings, overrideSettings } =
      this._defaultSelectOptions;
    let selectOptions: any = defaultSettings;

    if (isSelf) {
      selectOptions = isSelfSettings;
    }

    if (currentAPIUserRole == 'admin') {
      selectOptions = adminSettings;
    }

    if (isOverridingSelectOptions) {
      selectOptions = overrideSettings;
    }
    return selectOptions || defaultSettings;
  };

  protected _dbReturnTemplate = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    asyncCallback: any
  ): Promise<any> => {
    return await this._grantAccess(dbServiceAccessOptions, asyncCallback);
  };

  protected _grantAccess = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    asyncCallback: Promise<any>
  ): Promise<any | Error> => {
    try {
      let dbResult;
      const { isProtectedResource, isCurrentAPIUserPermitted } = dbServiceAccessOptions;
      const isAccessPermitted =
        (isProtectedResource && isCurrentAPIUserPermitted) || !isProtectedResource;

      if (isAccessPermitted) {
        dbResult = await asyncCallback;
        return dbResult;
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
    const selectOptions = this._configureSelectOptions(dbServiceAccessOptions);
    const asyncCallback = this._dbModel.findById(_id, selectOptions).lean();
    return await this._dbReturnTemplate(dbServiceAccessOptions, asyncCallback);
  };

  public find = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const selectOptions = this._configureSelectOptions(dbServiceAccessOptions);
    const asyncCallback = this._dbModel.find(searchQuery, selectOptions).lean();
    return await this._dbReturnTemplate(dbServiceAccessOptions, asyncCallback);
  };

  public insert = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const selectOptions = this._configureSelectOptions(dbServiceAccessOptions);
    const insertedModel = await this._dbModel.create(modelToInsert);
    const asyncCallback = await this._dbModel.findById(insertedModel._id, selectOptions).lean();
    return await this._dbReturnTemplate(dbServiceAccessOptions, asyncCallback);
  };

  public insertMany = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { modelToInsert, dbServiceAccessOptions } = dbServiceParams;
    const selectOptions = this._configureSelectOptions(dbServiceAccessOptions);
    const asyncCallback = await this._dbModel.insertMany(modelToInsert, selectOptions, {
      lean: true,
    });
    return await this._dbReturnTemplate(dbServiceAccessOptions, asyncCallback);
  };

  public findOneAndUpdate = async (dbServiceParams: {
    searchQuery?: {};
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, updateParams, dbServiceAccessOptions } = dbServiceParams;
    const selectOptions = this._configureSelectOptions(dbServiceAccessOptions);
    const asyncCallback = this._dbModel
      .findOneAndUpdate(searchQuery, updateParams, {
        fields: selectOptions,
        new: true,
      })
      .lean();
    return await this._dbReturnTemplate(dbServiceAccessOptions, asyncCallback);
  };

  public updateMany = async (dbServiceParams: {
    searchQuery?: {};
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateParams, dbServiceAccessOptions } = dbServiceParams;
    const selectOptions = this._configureSelectOptions(dbServiceAccessOptions);
    const asyncCallback = this._dbModel
      .updateMany(searchQuery, updateParams, {
        fields: selectOptions,
        new: true,
      })
      .lean();
    return await this._dbReturnTemplate(dbServiceAccessOptions, asyncCallback);
  };

  public findByIdAndDelete = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const asyncCallback = this._dbModel.findByIdAndDelete(_id).lean();
    return await this._dbReturnTemplate(dbServiceAccessOptions, asyncCallback);
  };

  public init = async (props: any): Promise<this> => {
    const { makeDb, cloneDeep, dbModel } = props;
    await makeDb();
    this._cloneDeep = cloneDeep;
    this._dbModel = dbModel;
    return this;
  };

  public getDefaultSelectOptions = () => {
    return this._cloneDeep(this._defaultSelectOptions);
  };
}

export { AbstractDbService };
