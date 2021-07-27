import { ObjectId } from 'mongoose';
import {
  DbServiceAccessOptions,
  DbModelViews,
  IDbService,
  DbServiceInitParams,
  DB_SERVICE_JOIN_TYPE,
} from './IDbService';

abstract class AbstractDbService<OptionalDbServiceInitParams, DbDoc>
  implements IDbService<OptionalDbServiceInitParams, DbDoc>
{
  protected _dbModel!: any;
  protected _dbModelViews!: DbModelViews;
  protected _cloneDeep!: any;
  protected _updateDbDependencyMode?: string;
  protected _joinType: string = DB_SERVICE_JOIN_TYPE.NONE;

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
    let dbQueryResult = await this._executeQuery({ dbServiceAccessOptions, dbQueryPromise });
    const hasLeftOuterJoin = this._joinType == DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
    const isResultArray = Array.isArray(dbQueryResult);
    const foreignKeyMapping = this._getForeignKeyObj();
    if (hasLeftOuterJoin && isResultArray) {
      const mappedQueryResult = dbQueryResult.map(async (dbDoc: StringKeyObject) => {
        return await this._joinDbDoc({ dbDoc, foreignKeyMapping });
      });
      dbQueryResult = await Promise.all(mappedQueryResult);
    } else if (hasLeftOuterJoin && !isResultArray) {
      dbQueryResult = await this._joinDbDoc({ dbDoc: dbQueryResult, foreignKeyMapping });
    }
    return dbQueryResult;
  };

  private _executeQuery = async (props: {
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbQueryPromise: Promise<any>;
  }): Promise<any> => {
    const { dbServiceAccessOptions, dbQueryPromise } = props;
    const { isProtectedResource, isCurrentAPIUserPermitted } = dbServiceAccessOptions;
    const isAccessPermitted =
      (isProtectedResource && isCurrentAPIUserPermitted) || !isProtectedResource;
    if (!isAccessPermitted) {
      throw new Error('Access denied.');
    }
    const dbQueryResult = await dbQueryPromise;
    return dbQueryResult;
  };

  protected _getForeignKeyObj = (): {} => {
    return {};
  };

  protected _joinDbDoc = async (props: {
    dbDoc: StringKeyObject;
    foreignKeyMapping: StringKeyObject;
  }): Promise<StringKeyObject> => {
    const { dbDoc, foreignKeyMapping } = props;
    const dbDocCopy: StringKeyObject = this._cloneDeep(dbDoc);
    if (dbDocCopy) {
      for (const joinProperty in foreignKeyMapping) {
        const foreignKeyData = foreignKeyMapping[joinProperty];
        const { foreignKeyName, ...otherForeignKeyData } = foreignKeyData;
        const props = { _id: dbDocCopy[foreignKeyName], ...otherForeignKeyData };
        dbDocCopy[joinProperty] = await this._getDbDataById(props);
      }
    }
    return dbDocCopy;
  };

  private _getDbDataById = async (props: {
    dbService: IDbService<any, any>;
    _id: ObjectId;
  }): Promise<any> => {
    const { dbService, _id } = props;
    const dbServiceAccessOptions = this._getBaseDbServiceAccessOptions();
    const dbData = await dbService.findById({ _id, dbServiceAccessOptions });
    return dbData;
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
  }): Promise<DbDoc> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions } = dbServiceParams;
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
    return dbQueryResult;
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
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions } = dbServiceParams;
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
