import { AccessOptions, DbParams, IDbOperations } from './IDbOperations';

type DefaultSelectOptions = {
  defaultSettings: {};
  adminSettings?: {};
  isSelfSettings?: {};
  overrideSettings?: {};
};

abstract class CommonDbOperations<DbDoc> implements IDbOperations<DbDoc> {
  protected _dbModel!: any;
  protected _cloneDeep!: any;
  protected _defaultSelectOptions!: DefaultSelectOptions;

  public findOne = async (params: DbParams): Promise<DbDoc> => {
    const { searchQuery, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this._dbModel.findOne(searchQuery, selectOptions).lean();
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  protected _configureSelectOptions = (accessOptions: AccessOptions): {} => {
    const { isSelf, currentAPIUserRole, isOverridingSelectOptions } = accessOptions || {};
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
    accessOptions: AccessOptions,
    asyncCallback: any
  ): Promise<any> => {
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  protected _grantAccess = async (
    accessOptions: AccessOptions,
    asyncCallback: Promise<any>
  ): Promise<any | Error> => {
    try {
      let dbResult;
      const { isProtectedResource, isCurrentAPIUserPermitted } = accessOptions;
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

  public findById = async (params: { _id?: any; accessOptions: AccessOptions }): Promise<DbDoc> => {
    const { _id, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this._dbModel.findById(_id, selectOptions).lean();
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  public find = async (params: {
    searchQuery?: {};
    accessOptions: AccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this._dbModel.find(searchQuery, selectOptions).lean();
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  public insert = async (params: {
    modelToInsert?: {};
    accessOptions: AccessOptions;
  }): Promise<DbDoc> => {
    const { modelToInsert, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const insertedModel = await this._dbModel.create(modelToInsert);
    const asyncCallback = await this._dbModel.findById(insertedModel._id, selectOptions).lean();
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  public insertMany = async (params: {
    modelToInsert?: {};
    accessOptions: AccessOptions;
  }): Promise<DbDoc[]> => {
    const { modelToInsert, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = await this._dbModel.insertMany(modelToInsert, selectOptions, {
      lean: true,
    });
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  public findOneAndUpdate = async (params: {
    searchQuery?: {};
    updateParams?: {};
    accessOptions: AccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, updateParams, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this._dbModel
      .findOneAndUpdate(searchQuery, updateParams, {
        fields: selectOptions,
        new: true,
      })
      .lean();
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  public updateMany = async (params: {
    searchQuery?: {};
    updateParams?: {};
    accessOptions: AccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateParams, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this._dbModel
      .updateMany(searchQuery, updateParams, {
        fields: selectOptions,
        new: true,
      })
      .lean();
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  public findByIdAndDelete = async (params: {
    _id?: any;
    accessOptions: AccessOptions;
  }): Promise<DbDoc> => {
    const { _id, accessOptions } = params;
    const asyncCallback = this._dbModel.findByIdAndDelete(_id).lean();
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
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

export { DefaultSelectOptions, CommonDbOperations };
