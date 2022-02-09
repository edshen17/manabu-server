"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_SERVICE_EMBED_TYPE = exports.AbstractEmbeddedDbService = void 0;
const AbstractDbService_1 = require("./AbstractDbService");
var DB_SERVICE_EMBED_TYPE;
(function (DB_SERVICE_EMBED_TYPE) {
    DB_SERVICE_EMBED_TYPE["SINGLE"] = "single";
    DB_SERVICE_EMBED_TYPE["MULTI"] = "multi";
})(DB_SERVICE_EMBED_TYPE || (DB_SERVICE_EMBED_TYPE = {}));
exports.DB_SERVICE_EMBED_TYPE = DB_SERVICE_EMBED_TYPE;
class AbstractEmbeddedDbService extends AbstractDbService_1.AbstractDbService {
    _parentDbService;
    _deepEqual;
    _embeddedFieldData;
    findOne = async (dbServiceParams) => {
        const { searchQuery, dbServiceAccessOptions, session } = dbServiceParams;
        const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
        const dbQueryPromise = this._parentDbService.findOne({
            searchQuery: embeddedSearchQuery,
            dbServiceAccessOptions,
            session,
        });
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
            searchQuery,
        });
        return dbQueryResult;
    };
    _convertToEmbeddedQuery = (query) => {
        const embeddedSearchQuery = {};
        for (const property in query) {
            const hasReserved$ = this._hasReserved$(property);
            if (hasReserved$) {
                embeddedSearchQuery[property] = this._convertToEmbeddedQuery(query[property]);
            }
            else {
                const embeddedProperty = `${this._embeddedFieldData.parentFieldName}.${property}`;
                embeddedSearchQuery[embeddedProperty] = query[property];
            }
        }
        return embeddedSearchQuery;
    };
    _hasReserved$ = (str) => {
        const hasReserved$ = str.startsWith('$');
        return hasReserved$;
    };
    _getDbQueryResult = async (props) => {
        const { dbQueryPromise, searchQuery, dbServiceAccessOptions } = props;
        const { isReturningParent } = dbServiceAccessOptions;
        const dbQueryResult = await dbQueryPromise;
        const embeddedParentFieldName = this._embeddedFieldData.parentFieldName;
        const isResultArray = Array.isArray(dbQueryResult);
        const isEmbeddedField = dbQueryResult && Array.isArray(dbQueryResult[embeddedParentFieldName]);
        let processedResult;
        if (!dbQueryResult) {
            return null;
        }
        else if (isReturningParent) {
            processedResult = dbQueryResult;
        }
        else if (isResultArray) {
            processedResult = dbQueryResult
                .map((dbDoc) => {
                if (dbDoc)
                    return this._handleEmbeddedField({
                        dbQueryResult: dbDoc[embeddedParentFieldName],
                        searchQuery,
                    });
            })
                .flat();
        }
        else if (isEmbeddedField) {
            processedResult = this._handleEmbeddedField({
                dbQueryResult: dbQueryResult[embeddedParentFieldName],
                searchQuery,
            });
        }
        else {
            processedResult = dbQueryResult[embeddedParentFieldName];
        }
        return processedResult;
    };
    _handleEmbeddedField = (props) => {
        const { dbQueryResult, searchQuery } = props;
        const isResultArray = Array.isArray(dbQueryResult);
        if (isResultArray) {
            let dbDoc;
            dbQueryResult.forEach((childDbDoc) => {
                let isMatchedEmbeddedDoc = true;
                for (const property in searchQuery) {
                    const endsWithIdRegex = /id$/i;
                    const isObjectId = endsWithIdRegex.test(property);
                    if (isObjectId) {
                        isMatchedEmbeddedDoc =
                            childDbDoc[property].toString() == searchQuery[property].toString();
                    }
                    else {
                        isMatchedEmbeddedDoc = this._deepEqual(childDbDoc[property], searchQuery[property]);
                    }
                }
                if (isMatchedEmbeddedDoc) {
                    dbDoc = childDbDoc;
                }
            });
            return dbDoc || dbQueryResult;
        }
        else {
            return dbQueryResult;
        }
    };
    findById = async (dbServiceParams) => {
        const { _id, dbServiceAccessOptions, session } = dbServiceParams;
        const searchQuery = { _id };
        const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
        const dbQueryPromise = this._parentDbService.findOne({
            searchQuery: embeddedSearchQuery,
            dbServiceAccessOptions,
            session,
        });
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
            searchQuery,
        });
        return dbQueryResult;
    };
    find = async (dbServiceParams) => {
        const { searchQuery, dbServiceAccessOptions, session, paginationOptions } = dbServiceParams;
        const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
        const dbQueryPromise = this._parentDbService.find({
            searchQuery: embeddedSearchQuery,
            dbServiceAccessOptions,
            session,
            paginationOptions,
        });
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
            searchQuery,
        });
        return dbQueryResult;
    };
    countDocuments = async (dbServiceParams) => {
        const { searchQuery, dbServiceAccessOptions, session } = dbServiceParams;
        const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
        const dbQueryPromise = this._parentDbService.countDocuments({
            searchQuery: embeddedSearchQuery,
            dbServiceAccessOptions,
            session,
        });
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
            searchQuery,
        });
        return dbQueryResult;
    };
    insert = async (dbServiceParams) => {
        throw new Error('Cannot insert an embedded document. Use findOneAndUpdate/updateMany on the parent document instead.');
    };
    insertMany = async (dbServiceParams) => {
        throw new Error('Cannot insert many embedded documents. Use findOneAndUpdate/updateMany on the parent document instead.');
    };
    findOneAndUpdate = async (dbServiceParams) => {
        const { searchQuery, updateQuery, dbServiceAccessOptions, queryOptions, session } = dbServiceParams;
        const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
        const embeddedUpdateQuery = this._convertToEmbeddedQuery(updateQuery);
        const processedUpdateQuery = this._configureEmbeddedUpdateQuery(embeddedUpdateQuery);
        const dbQueryPromise = this._parentDbService.findOneAndUpdate({
            searchQuery: embeddedSearchQuery,
            updateQuery: processedUpdateQuery,
            queryOptions,
            dbServiceAccessOptions,
            session,
        });
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
            searchQuery,
        });
        return dbQueryResult;
    };
    _configureEmbeddedUpdateQuery = (updateQuery) => {
        const isSingleEmbed = this._embeddedFieldData.embedType == DB_SERVICE_EMBED_TYPE.SINGLE;
        const embeddedChildFieldName = this._embeddedFieldData.childFieldName;
        if (isSingleEmbed) {
            const processedUpdateQuery = {
                $set: {},
            };
            for (const property in updateQuery) {
                if (embeddedChildFieldName) {
                    const embeddedFieldRef = `${property.replace(embeddedChildFieldName, `${embeddedChildFieldName}.$`)}`;
                    if (this._hasReserved$(property)) {
                        processedUpdateQuery[embeddedFieldRef] = updateQuery[property];
                    }
                    else {
                        processedUpdateQuery.$set[embeddedFieldRef] = updateQuery[property];
                    }
                }
            }
            return processedUpdateQuery;
        }
        else {
            return updateQuery;
        }
    };
    updateMany = async (dbServiceParams) => {
        const { searchQuery, updateQuery, dbServiceAccessOptions, queryOptions, session } = dbServiceParams;
        const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
        const embeddedUpdateQuery = this._convertToEmbeddedQuery(updateQuery);
        const processedUpdateQuery = this._configureEmbeddedUpdateQuery(embeddedUpdateQuery);
        const dbQueryPromise = this._parentDbService.updateMany({
            searchQuery: embeddedSearchQuery,
            updateQuery: processedUpdateQuery,
            dbServiceAccessOptions,
            queryOptions,
            session,
        });
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
            searchQuery,
        });
        return dbQueryResult;
    };
    // NOTE: The DELETE methods return the new embedded doc. For example, if you remove 1 from [1,2], this returns [2].
    findByIdAndDelete = async (dbServiceParams) => {
        const { _id, dbServiceAccessOptions, session } = dbServiceParams;
        const dbQueryResult = await this.findOneAndDelete({
            searchQuery: { _id },
            dbServiceAccessOptions,
            session,
        });
        return dbQueryResult;
    };
    findOneAndDelete = async (dbServiceParams) => {
        const { searchQuery, dbServiceAccessOptions, session } = dbServiceParams;
        const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
        const updateQuery = this._configureDeleteUpdateQuery(searchQuery);
        const dbQueryPromise = this._parentDbService.findOneAndUpdate({
            searchQuery: embeddedSearchQuery,
            updateQuery,
            dbServiceAccessOptions,
            session,
        });
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
            searchQuery,
        });
        return dbQueryResult;
    };
    _configureDeleteUpdateQuery = (searchQuery) => {
        const isSingleEmbed = this._embeddedFieldData.embedType == DB_SERVICE_EMBED_TYPE.SINGLE;
        const embeddedParentFieldName = this._embeddedFieldData.parentFieldName;
        if (isSingleEmbed) {
            const deleteUpdateQuery = { $unset: {} };
            deleteUpdateQuery.$unset[embeddedParentFieldName] = true;
            return deleteUpdateQuery;
        }
        else {
            const deleteUpdateQuery = { $pull: {} };
            deleteUpdateQuery.$pull[embeddedParentFieldName] = searchQuery;
            return deleteUpdateQuery;
        }
    };
}
exports.AbstractEmbeddedDbService = AbstractEmbeddedDbService;
