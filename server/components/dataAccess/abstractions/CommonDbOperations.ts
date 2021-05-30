import { AccessOption, IDbOperations } from './IDbOperations';

export abstract class CommonDbOperations implements IDbOperations {
  protected dbModel: any;
  constructor(dbModel: any) {
    this.dbModel = dbModel;
  }

  protected _grantAccess = async (
    accessOptions: AccessOption,
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
        throw new Error('Resource was not found.');
      } else {
        throw new Error('Access denied');
      }
    } catch (err) {
      throw err;
    }
  };

  public findOne = async (params: {
    searchQuery: {};
    accessOptions: AccessOption;
  }): Promise<any | Error> => {
    const { searchQuery, accessOptions } = params;
    const asyncCallback = this.dbModel.findOne(searchQuery);
    return this._grantAccess(accessOptions, asyncCallback);
  };

  public findById = async (params: {
    id: string;
    accessOptions: AccessOption;
  }): Promise<any | Error> => {
    const { id, accessOptions } = params;
    const asyncCallback = this.dbModel.findById(id);
    return this._grantAccess(accessOptions, asyncCallback);
  };

  public find = async (params: {
    searchQuery: {};
    accessOptions: AccessOption;
  }): Promise<any | Error> => {
    const { searchQuery, accessOptions } = params;
    const asyncCallback = this.dbModel.find(searchQuery);
    return this._grantAccess(accessOptions, asyncCallback);
  };

  public insert = async (params: {
    modelToInsert: {};
    accessOptions: AccessOption;
  }): Promise<any | Error> => {
    const { modelToInsert, accessOptions } = params;
    const asyncCallback = this.dbModel.create(modelToInsert);
    return this._grantAccess(accessOptions, asyncCallback);
  };

  public update = async (params: {
    searchQuery: {};
    updateParams: {};
    accessOptions: any;
  }): Promise<any | Error> => {
    const { searchQuery, updateParams, accessOptions } = params;
    const asyncCallback = this.dbModel.findOneAndUpdate(searchQuery, updateParams);
    return this._grantAccess(accessOptions, asyncCallback);
  };

  public build = async (...args: any): Promise<IDbOperations> => {
    for (const promise of args) await promise;
    return this;
  };
}
