import { AccessOptions, DbParams, IDbOperations } from './IDbOperations';

type DefaultSelectOptions = {
  defaultSettings: {};
  adminSettings?: {};
  isSelfSettings?: {};
};

abstract class CommonDbOperations<DbDoc> implements IDbOperations<DbDoc> {
  protected dbModel: any;
  public defaultSelectOptions!: DefaultSelectOptions;
  constructor(dbModel: any) {
    this.dbModel = dbModel;
  }

  protected _configureSelectOptions = (accessOptions: AccessOptions): {} => {
    const { isSelf, currentAPIUserRole } = accessOptions;
    const { defaultSettings, adminSettings, isSelfSettings } = this.defaultSelectOptions;
    let selectOptions: any = defaultSettings;

    if (isSelf) {
      selectOptions = isSelfSettings;
    }

    if (currentAPIUserRole == 'admin') {
      selectOptions = adminSettings;
    }

    return selectOptions || defaultSettings;
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
      } else if (isAccessPermitted && !dbResult) {
        throw new Error(`${this.dbModel.collection.collectionName} was not found.`);
      } else {
        throw new Error('Access denied.');
      }
    } catch (err) {
      throw err;
    }
  };

  protected _findOneTemplate = (params: DbParams): any => {
    const { searchQuery, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel.findOne(searchQuery, selectOptions).lean();
    return { accessOptions, asyncCallback };
  };

  protected _dbReturnTemplate = async (
    accessOptions: AccessOptions,
    asyncCallback: any
  ): Promise<any> => {
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public findOne = async (params: DbParams): Promise<DbDoc> => {
    const { accessOptions, asyncCallback } = this._findOneTemplate(params);
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  protected _findByIdTemplate = (params: DbParams): any => {
    const { _id, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel.findById(_id, selectOptions).lean();
    return { accessOptions, asyncCallback };
  };

  public findById = async (params: DbParams): Promise<DbDoc> => {
    const { accessOptions, asyncCallback } = this._findByIdTemplate(params);
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  protected _findTemplate = (params: DbParams): any => {
    const { searchQuery, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel.find(searchQuery, selectOptions).lean();
    return { accessOptions, asyncCallback };
  };

  public find = async (params: DbParams): Promise<DbDoc[]> => {
    const { accessOptions, asyncCallback } = this._findTemplate(params);
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  protected _insertTemplate = async (params: DbParams): Promise<any> => {
    const { modelToInsert, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const insertedModel = await this.dbModel.create(modelToInsert);
    const asyncCallback = await this.dbModel.findById(insertedModel._id, selectOptions).lean();
    return { accessOptions, asyncCallback };
  };

  public insert = async (params: DbParams): Promise<DbDoc> => {
    const { accessOptions, asyncCallback } = await this._insertTemplate(params);
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  protected _updateTemplate = async (params: DbParams): Promise<any> => {
    const { searchQuery, updateParams, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel
      .findOneAndUpdate(searchQuery, updateParams, {
        fields: selectOptions,
        new: true,
      })
      .lean();
    return { accessOptions, asyncCallback };
  };

  public update = async (params: DbParams): Promise<DbDoc> => {
    const { accessOptions, asyncCallback } = await this._updateTemplate(params);
    return await this._dbReturnTemplate(accessOptions, asyncCallback);
  };

  public init = async (props: any): Promise<this> => {
    await props.makeDb();
    return this;
  };
}

export { DefaultSelectOptions, CommonDbOperations };
