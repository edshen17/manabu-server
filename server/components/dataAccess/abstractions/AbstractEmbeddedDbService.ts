import { AbstractDbService } from './AbstractDbService';
import { DbDependencyUpdateParams, DbServiceAccessOptions, IDbService } from './IDbService';

type AbstractEmbeddedDbServiceInitParams<OptionalDbServiceInitParams> = {
  makeParentDbService: Promise<IDbService<any, any>>;
  deepEqual: any;
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
  protected _deepEqual!: any;
  protected _embeddedFieldData!: {
    parentFieldName: string;
    childFieldName?: string;
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
    const dbQueryResult = await this._dbQueryReturnTemplate({
      dbServiceAccessOptions,
      dbQueryPromise,
      searchQuery,
    });
    return dbQueryResult;
  };

  protected _convertToEmbeddedQuery = (query?: StringKeyObject): {} => {
    const embeddedSearchQuery: StringKeyObject = {};
    for (const property in query) {
      const embeddedProperty = `${this._embeddedFieldData.parentFieldName}.${property}`;
      embeddedSearchQuery[embeddedProperty] = query[property];
    }
    return embeddedSearchQuery;
  };

  protected _dbQueryReturnTemplate = async (props: {
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbQueryPromise: any;
    searchQuery?: {};
  }): Promise<any> => {
    const { dbQueryPromise, searchQuery } = props;
    const dbQueryResult = await dbQueryPromise;
    const embeddedParentFieldName = this._embeddedFieldData.parentFieldName;
    const isResultArray = Array.isArray(dbQueryResult);
    const isEmbeddedArray = dbQueryResult && Array.isArray(dbQueryResult[embeddedParentFieldName]);
    let processedResult;
    if (!dbQueryResult) {
      return null;
    } else if (isResultArray) {
      processedResult = dbQueryResult
        .map((dbDoc: any) => {
          if (dbDoc)
            return this._handleEmbeddedArray({
              dbQueryResult: dbDoc[embeddedParentFieldName],
              searchQuery,
            });
        })
        .flat();
    } else if (isEmbeddedArray) {
      processedResult = this._handleEmbeddedArray({
        dbQueryResult: dbQueryResult[embeddedParentFieldName],
        searchQuery,
      });
    } else {
      processedResult = dbQueryResult[embeddedParentFieldName];
    }
    return processedResult;
  };

  private _handleEmbeddedArray = (props: { dbQueryResult: any; searchQuery?: StringKeyObject }) => {
    const { dbQueryResult, searchQuery } = props;
    if (Array.isArray(dbQueryResult)) {
      const dbDoc = dbQueryResult.find((pkg) => {
        let isMatchedEmbeddedDoc = true;
        for (const property in searchQuery) {
          isMatchedEmbeddedDoc =
            isMatchedEmbeddedDoc && this._deepEqual(pkg[property], searchQuery[property]);
        }
        return isMatchedEmbeddedDoc;
      });
      return dbDoc || dbQueryResult;
    } else {
      return dbQueryResult;
    }
  };

  public findById = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const searchQuery = { _id };
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const dbQueryPromise = this._parentDbService.findOne({
      searchQuery: embeddedSearchQuery,
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate({
      dbServiceAccessOptions,
      dbQueryPromise,
      searchQuery,
    });
    const processedResult = this._handleEmbeddedArray({ dbQueryResult, searchQuery });
    return processedResult;
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
    const dbQueryResult = await this._dbQueryReturnTemplate({
      dbServiceAccessOptions,
      dbQueryPromise,
      searchQuery,
    });
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
    const processedUpdateParams = this._configureUpdateParams(embeddedUpdateQuery);
    console.log(processedUpdateParams, 'here proces');
    // const embeddedDbDependencyUpdateQuery = this._convertToEmbeddedQuery(dbDependencyUpdateParams); //needs to be updateparams.searchQuery
    const dbQueryPromise = this._parentDbService.findOneAndUpdate({
      searchQuery: embeddedSearchQuery,
      updateParams: processedUpdateParams,
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate({
      dbServiceAccessOptions,
      dbQueryPromise,
      searchQuery,
    });
    // await this._updateDbDependencyHandler({
    //   dbDependencyUpdateParams: embeddedDbDependencyUpdateQuery,
    // });
    return dbQueryResult;
  };

  private _configureUpdateParams = (updateQuery?: StringKeyObject) => {
    const isMultiEmbed = this._embeddedFieldData.embedType == DB_SERVICE_EMBED_TYPE.SINGLE;
    const embeddedChildFieldName = this._embeddedFieldData.childFieldName;
    if (isMultiEmbed && embeddedChildFieldName) {
      const updateParams: StringKeyObject = {
        $set: {},
      };
      for (const property in updateQuery) {
        const embeddedFieldRef = `${property.replace(
          embeddedChildFieldName,
          `${embeddedChildFieldName}.$`
        )}`;
        updateParams.$set[embeddedFieldRef] = updateQuery[property];
      }
      return updateParams;
    } else {
      return updateQuery;
    }
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
    const processedUpdateParams = this._configureUpdateParams(embeddedUpdateQuery);
    const embeddedDbDependencyUpdateQuery = this._convertToEmbeddedQuery(dbDependencyUpdateParams);
    const dbQueryPromise = this._parentDbService.updateMany({
      searchQuery: embeddedSearchQuery,
      updateParams: processedUpdateParams,
      dbServiceAccessOptions,
      dbDependencyUpdateParams: embeddedDbDependencyUpdateQuery,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate({
      dbServiceAccessOptions,
      dbQueryPromise,
      searchQuery,
    });
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
    const dbQueryResult = await this._dbQueryReturnTemplate({
      dbServiceAccessOptions,
      dbQueryPromise,
      searchQuery,
    });
    return dbQueryResult;
  };

  private _configureDeleteUpdateParams = (searchQuery?: {}) => {
    const isMultiEmbed = this._embeddedFieldData.embedType == DB_SERVICE_EMBED_TYPE.MULTI;
    const embeddedParentFieldName = this._embeddedFieldData.parentFieldName;
    if (!isMultiEmbed) {
      const updateDeleteParams: StringKeyObject = { $unset: {} };
      updateDeleteParams.$unset[embeddedParentFieldName] = true;
      return updateDeleteParams;
    } else {
      const updateDeleteParams: StringKeyObject = { $pull: {} };
      updateDeleteParams.$pull[embeddedParentFieldName] = searchQuery;
      return updateDeleteParams;
    }
  };
}

export { AbstractEmbeddedDbService, DB_SERVICE_EMBED_TYPE, AbstractEmbeddedDbServiceInitParams };
