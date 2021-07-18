import { AbstractDbService } from './AbstractDbService';
import { DbDependencyUpdateParams, DbServiceAccessOptions, IDbService } from './IDbService';

type AbstractEmbeddedDbServiceInitParams<OptionalDbServiceInitParams> = {
  makeParentDbService: Promise<IDbService<any, any>>;
} & OptionalDbServiceInitParams;

enum DB_SERVICE_EMBED_TYPE {
  SINGLE = 'single',
  MULTI = 'multi',
}

abstract class AbstractEmbeddedDbService<
  OptionalDbServiceInitParams,
  DbDoc
> extends AbstractDbService<
  AbstractEmbeddedDbServiceInitParams<OptionalDbServiceInitParams>,
  DbDoc
> {
  protected _parentDbService!: IDbService<any, any>;
  protected _embeddedFieldData!: {
    fieldName: string;
    embedType: string;
  };

  public findOne = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const dbQueryPromise = this._parentDbService.findOne({
      searchQuery: embeddedSearchQuery,
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  protected _convertToEmbeddedQuery = (query?: StringKeyObject): {} => {
    const embeddedSearchQuery: StringKeyObject = {};
    for (const property in query) {
      const embeddedProperty = `teacherData.${property}`;
      embeddedSearchQuery[embeddedProperty] = query[property];
    }
    return embeddedSearchQuery;
  };

  protected _dbQueryReturnTemplate = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    dbQueryPromise: any
  ): Promise<any> => {
    const dbQueryResult = await dbQueryPromise;
    const embeddedFieldName = this._embeddedFieldData.fieldName;
    if (!dbQueryResult) {
      return null;
    }
    if (Array.isArray(dbQueryResult)) {
      const savedDbDocs = dbQueryResult.map((dbDoc) => {
        return dbDoc[embeddedFieldName];
      });
      return savedDbDocs;
    } else {
      const savedDbDoc = dbQueryResult[embeddedFieldName];
      return savedDbDoc;
    }
  };

  public findById = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery({ _id });
    const dbQueryPromise = this._parentDbService.findOne({
      searchQuery: embeddedSearchQuery,
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public find = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const dbQueryPromise = this._parentDbService.find({
      searchQuery: embeddedSearchQuery,
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public insert = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    throw new Error('Cannot insert an embedded document.');
  };

  public insertMany = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    throw new Error('Cannot insert many embedded documents.');
  };

  public findOneAndUpdate = async (dbServiceParams: {
    searchQuery?: {};
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<DbDoc> => {
    const { searchQuery, updateParams, dbServiceAccessOptions, dbDependencyUpdateParams } =
      dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const embeddedUpdateQuery = this._convertToEmbeddedQuery(updateParams);
    const embeddedDbDependencyUpdateQuery = this._convertToEmbeddedQuery(dbDependencyUpdateParams);
    const dbQueryPromise = this._parentDbService.findOneAndUpdate({
      searchQuery: embeddedSearchQuery,
      updateParams: embeddedUpdateQuery,
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    await this._updateDbDependencyHandler({
      dbDependencyUpdateParams: embeddedDbDependencyUpdateQuery,
    });
    return dbQueryResult;
  };

  public updateMany = async (dbServiceParams: {
    searchQuery?: {};
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateParams, dbServiceAccessOptions, dbDependencyUpdateParams } =
      dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const embeddedUpdateQuery = this._convertToEmbeddedQuery(updateParams);
    const embeddedDbDependencyUpdateQuery = this._convertToEmbeddedQuery(dbDependencyUpdateParams);
    const dbQueryPromise = this._parentDbService.updateMany({
      searchQuery: embeddedSearchQuery,
      updateParams: embeddedUpdateQuery,
      dbServiceAccessOptions,
      dbDependencyUpdateParams: embeddedDbDependencyUpdateQuery,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    await this._updateDbDependencyHandler({ dbDependencyUpdateParams });
    return dbQueryResult;
  };

  public findByIdAndDelete = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions, dbDependencyUpdateParams } = dbServiceParams;
    const dbQueryResult = await this.findOneAndDelete({
      searchQuery: { _id },
      dbServiceAccessOptions,
      dbDependencyUpdateParams,
    });
    return dbQueryResult;
  };

  public findOneAndDelete = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<DbDoc> => {
    const { searchQuery, dbServiceAccessOptions, dbDependencyUpdateParams } = dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const updateParams = this._configureDeleteUpdateParams(searchQuery);
    const dbQueryPromise = this._parentDbService.findOneAndUpdate({
      searchQuery: embeddedSearchQuery,
      updateParams,
      dbServiceAccessOptions,
      dbDependencyUpdateParams,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  private _configureDeleteUpdateParams = (searchQuery?: {}) => {
    const isMultiEmbed = this._embeddedFieldData.embedType == DB_SERVICE_EMBED_TYPE.SINGLE;
    const embeddedFieldName = this._embeddedFieldData.fieldName;
    if (isMultiEmbed) {
      const updateDeleteParams: StringKeyObject = { $unset: {} };
      updateDeleteParams.$unset[embeddedFieldName] = true;
      return updateDeleteParams;
    } else {
      const updateDeleteParams: StringKeyObject = { $pull: {} };
      updateDeleteParams.$pull[embeddedFieldName] = searchQuery;
      return updateDeleteParams;
    }
  };
}

export { AbstractEmbeddedDbService, DB_SERVICE_EMBED_TYPE, AbstractEmbeddedDbServiceInitParams };
