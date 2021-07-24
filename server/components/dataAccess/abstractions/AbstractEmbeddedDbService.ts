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
      const hasReserved$ = this._hasReserved$(property);
      if (hasReserved$) {
        embeddedSearchQuery[property] = this._convertToEmbeddedQuery(query[property]);
      } else {
        const embeddedProperty = `${this._embeddedFieldData.parentFieldName}.${property}`;
        embeddedSearchQuery[embeddedProperty] = query[property];
      }
    }
    return embeddedSearchQuery;
  };

  private _hasReserved$ = (str: string): boolean => {
    let hasReserved$ = str.startsWith('$');
    return hasReserved$;
  };

  protected _dbQueryReturnTemplate = async (props: {
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbQueryPromise: any;
    searchQuery?: {};
  }): Promise<any> => {
    const { dbQueryPromise, searchQuery, dbServiceAccessOptions } = props;
    const { isReturningParent } = dbServiceAccessOptions;
    const dbQueryResult = await dbQueryPromise;
    const embeddedParentFieldName = this._embeddedFieldData.parentFieldName;
    const isResultArray = Array.isArray(dbQueryResult);
    const isEmbeddedField = dbQueryResult && Array.isArray(dbQueryResult[embeddedParentFieldName]);
    let processedResult;
    if (!dbQueryResult) {
      return null;
    } else if (isResultArray) {
      processedResult = dbQueryResult
        .map((dbDoc: any) => {
          if (dbDoc)
            return this._handleEmbeddedField({
              dbQueryResult: dbDoc[embeddedParentFieldName],
              searchQuery,
            });
        })
        .flat();
    } else if (isEmbeddedField) {
      processedResult = this._handleEmbeddedField({
        dbQueryResult: dbQueryResult[embeddedParentFieldName],
        searchQuery,
      });
    } else if (isReturningParent) {
      processedResult = dbQueryResult;
    } else {
      processedResult = dbQueryResult[embeddedParentFieldName];
    }
    return processedResult;
  };

  private _handleEmbeddedField = (props: { dbQueryResult: any; searchQuery?: StringKeyObject }) => {
    const { dbQueryResult, searchQuery } = props;
    const isResultArray = Array.isArray(dbQueryResult);
    if (isResultArray) {
      const dbDoc = dbQueryResult.find((childDbDoc: any) => {
        let isMatchedEmbeddedDoc = true;
        for (const property in searchQuery) {
          isMatchedEmbeddedDoc =
            isMatchedEmbeddedDoc && this._deepEqual(childDbDoc[property], searchQuery[property]);
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
    throw new Error('Cannot insert an embedded document. Use findOneAndUpdate/updateMany instead.');
  };

  public insertMany = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<DbDoc[]> => {
    throw new Error(
      'Cannot insert many embedded documents. Use findOneAndUpdate/updateMany instead.'
    );
  };

  public findOneAndUpdate = async (dbServiceParams: {
    searchQuery?: {};
    updateQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<DbDoc> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions, dbDependencyUpdateParams } =
      dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const embeddedUpdateQuery = this._convertToEmbeddedQuery(updateQuery);
    const processedUpdateQuery = this._configureEmbeddedUpdateQuery(embeddedUpdateQuery);
    const embeddedDbDependencyUpdateParams =
      this._configureDependencyUpdateParams(dbDependencyUpdateParams);
    const dbQueryPromise = this._parentDbService.findOneAndUpdate({
      searchQuery: embeddedSearchQuery,
      updateQuery: processedUpdateQuery,
      dbServiceAccessOptions,
      dbDependencyUpdateParams: embeddedDbDependencyUpdateParams,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate({
      dbServiceAccessOptions,
      dbQueryPromise,
      searchQuery,
    });
    await this._updateDbDependencyHandler({
      dbDependencyUpdateParams,
    });
    return dbQueryResult;
  };

  private _configureEmbeddedUpdateQuery = (updateQuery?: StringKeyObject) => {
    const isSingleEmbed = this._embeddedFieldData.embedType == DB_SERVICE_EMBED_TYPE.SINGLE;
    const embeddedChildFieldName = this._embeddedFieldData.childFieldName;
    if (isSingleEmbed) {
      const processedUpdateQuery: StringKeyObject = {
        $set: {},
      };
      for (const property in updateQuery) {
        if (embeddedChildFieldName) {
          const embeddedFieldRef = `${property.replace(
            embeddedChildFieldName,
            `${embeddedChildFieldName}.$`
          )}`;
          if (this._hasReserved$(property)) {
            processedUpdateQuery[embeddedFieldRef] = updateQuery[property];
          } else {
            processedUpdateQuery.$set[embeddedFieldRef] = updateQuery[property];
          }
        }
      }
      return processedUpdateQuery;
    } else {
      return updateQuery;
    }
  };

  private _configureDependencyUpdateParams = (
    dbDependencyUpdateParams?: DbDependencyUpdateParams
  ) => {
    if (dbDependencyUpdateParams) {
      const { updatedDependentSearchQuery, embeddedUpdatedDependentSearchQuery } =
        dbDependencyUpdateParams;
      const updatedDependentSearchQueryCopy = this._cloneDeep(updatedDependentSearchQuery);
      if (!embeddedUpdatedDependentSearchQuery) {
        dbDependencyUpdateParams.embeddedUpdatedDependentSearchQuery =
          updatedDependentSearchQueryCopy;
      }
      dbDependencyUpdateParams.updatedDependentSearchQuery = this._convertToEmbeddedQuery(
        updatedDependentSearchQuery
      );
    }
    return dbDependencyUpdateParams;
  };

  public updateMany = async (dbServiceParams: {
    searchQuery?: {};
    updateQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<DbDoc[]> => {
    const { searchQuery, updateQuery, dbServiceAccessOptions, dbDependencyUpdateParams } =
      dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const embeddedUpdateQuery = this._convertToEmbeddedQuery(updateQuery);
    const processedUpdateQuery = this._configureEmbeddedUpdateQuery(embeddedUpdateQuery);
    const embeddedDbDependencyUpdateParams =
      this._configureDependencyUpdateParams(dbDependencyUpdateParams);
    const dbQueryPromise = this._parentDbService.updateMany({
      searchQuery: embeddedSearchQuery,
      updateQuery: processedUpdateQuery,
      dbServiceAccessOptions,
      dbDependencyUpdateParams: embeddedDbDependencyUpdateParams,
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
    const updateQuery = this._configureDeleteUpdateQuery(searchQuery);
    const dbQueryPromise = this._parentDbService.findOneAndUpdate({
      searchQuery: embeddedSearchQuery,
      updateQuery,
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

  protected _getUpdatedDependeeDocs = async (props: {
    dbDependencyUpdateParams: DbDependencyUpdateParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { dbDependencyUpdateParams, dbServiceAccessOptions } = props;
    const { embeddedUpdatedDependentSearchQuery, updatedDependentSearchQuery } =
      dbDependencyUpdateParams;
    let updatedDependeeDocs: any[];
    if (!this._embeddedFieldData.childFieldName) {
      updatedDependeeDocs = await this.find({
        searchQuery: embeddedUpdatedDependentSearchQuery,
        dbServiceAccessOptions,
      });
    } else {
      updatedDependeeDocs = await this.find({
        searchQuery: updatedDependentSearchQuery,
        dbServiceAccessOptions,
      });
    }
    return updatedDependeeDocs;
  };

  private _configureDeleteUpdateQuery = (searchQuery?: StringKeyObject) => {
    const isSingleEmbed = this._embeddedFieldData.embedType == DB_SERVICE_EMBED_TYPE.SINGLE;
    const embeddedParentFieldName = this._embeddedFieldData.parentFieldName;
    if (isSingleEmbed) {
      const deleteUpdateQuery: StringKeyObject = { $unset: {} };
      deleteUpdateQuery.$unset[embeddedParentFieldName] = true;
      return deleteUpdateQuery;
    } else {
      const deleteUpdateQuery: StringKeyObject = { $pull: {} };
      deleteUpdateQuery.$pull[embeddedParentFieldName] = searchQuery;
      return deleteUpdateQuery;
    }
  };
}

export { AbstractEmbeddedDbService, DB_SERVICE_EMBED_TYPE, AbstractEmbeddedDbServiceInitParams };
