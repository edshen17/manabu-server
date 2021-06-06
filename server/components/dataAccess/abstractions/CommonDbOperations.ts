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

  public findOne = async (params: DbParams): Promise<DbDoc> => {
    const { searchQuery, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel.findOne(searchQuery, selectOptions).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public findById = async (params: DbParams): Promise<DbDoc> => {
    const { id, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel.findById(id, selectOptions).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public find = async (params: DbParams): Promise<DbDoc[]> => {
    const { searchQuery, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel.find(searchQuery, selectOptions).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public insert = async (params: DbParams): Promise<DbDoc> => {
    const { modelToInsert, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const insertedModel = await this.dbModel.create(modelToInsert);
    const asyncCallback = await this.dbModel.findById(insertedModel._id, selectOptions).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public update = async (params: DbParams): Promise<DbDoc> => {
    const { searchQuery, updateParams, accessOptions } = params;
    const selectOptions = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel
      .findOneAndUpdate(searchQuery, updateParams, {
        fields: selectOptions,
        new: true,
      })
      .lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public init = async (props: any): Promise<this> => {
    await props.makeDb();
    return this;
  };
}

export { DefaultSelectOptions, CommonDbOperations };
