import { AccessOptions, DbParams, IDbOperations } from './IDbOperations';

type DefaultSelectSettings = {
  defaultSettings: {};
  adminSettings?: {};
  isSelfSettings?: {};
};

abstract class CommonDbOperations<DbDoc> implements IDbOperations<DbDoc> {
  protected dbModel: any;
  protected defaultSelectSettings!: DefaultSelectSettings;
  constructor(dbModel: any) {
    this.dbModel = dbModel;
  }

  protected _configureSelectOptions = (accessOptions: AccessOptions): {} => {
    const { isSelf, currentAPIUserRole } = accessOptions;
    const { defaultSettings, adminSettings, isSelfSettings } = this.defaultSelectSettings;
    let selectSettings: any = JSON.parse(JSON.stringify(defaultSettings));

    if (isSelf) {
      selectSettings = isSelfSettings || defaultSettings;
    }

    if (currentAPIUserRole == 'admin') {
      selectSettings = { ...isSelfSettings, ...adminSettings };
    }

    console.log(selectSettings);

    return selectSettings;
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
        throw new Error('Access denied');
      }
    } catch (err) {
      throw err;
    }
  };

  public findOne = async (params: DbParams): Promise<DbDoc> => {
    const { searchQuery, accessOptions } = params;
    const selectSettings = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel.findOne(searchQuery, selectSettings).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public findById = async (params: DbParams): Promise<DbDoc> => {
    const { id, accessOptions } = params;
    const selectSettings = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel.findById(id, selectSettings).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public find = async (params: DbParams): Promise<[DbDoc]> => {
    const { searchQuery, accessOptions } = params;
    const selectSettings = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel.find(searchQuery, selectSettings).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public insert = async (params: DbParams): Promise<DbDoc> => {
    const { modelToInsert, accessOptions } = params;
    const asyncCallback = this.dbModel.create(modelToInsert);
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public update = async (params: DbParams): Promise<DbDoc> => {
    const { searchQuery, updateParams, accessOptions } = params;
    const selectSettings = this._configureSelectOptions(accessOptions);
    const asyncCallback = this.dbModel
      .findOneAndUpdate(searchQuery, updateParams, {
        fields: selectSettings,
        returnOriginal: false,
      })
      .lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public build = async (...args: any): Promise<this> => {
    for (const promise of args) await promise;
    return this;
  };
}

export { DefaultSelectSettings, CommonDbOperations };
