import { AccessOptions, DbParams, IDbOperations } from './IDbOperations';

export abstract class CommonDbOperations<DbDoc> implements IDbOperations<DbDoc> {
  protected dbModel: any;
  constructor(dbModel: any) {
    this.dbModel = dbModel;
  }

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
    const asyncCallback = this.dbModel.findOne(searchQuery).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public findById = async (params: DbParams): Promise<DbDoc> => {
    const { id, accessOptions } = params;
    const asyncCallback = this.dbModel.findById(id).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public find = async (params: DbParams): Promise<[DbDoc]> => {
    const { searchQuery, accessOptions } = params;
    const asyncCallback = this.dbModel.find(searchQuery).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public insert = async (params: DbParams): Promise<DbDoc> => {
    const { modelToInsert, accessOptions } = params;
    const asyncCallback = this.dbModel.create(modelToInsert);
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public update = async (params: DbParams): Promise<DbDoc> => {
    const { searchQuery, updateParams, accessOptions } = params;
    const asyncCallback = this.dbModel.findOneAndUpdate(searchQuery, updateParams).lean();
    return await this._grantAccess(accessOptions, asyncCallback);
  };

  public build = async (...args: any): Promise<this> => {
    for (const promise of args) await promise;
    return this;
  };
}
