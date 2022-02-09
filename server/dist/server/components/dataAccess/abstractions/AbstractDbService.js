"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDbService = void 0;
const constants_1 = require("../../../constants");
const cacheDbService_1 = require("../services/cache/cacheDbService");
const IDbService_1 = require("./IDbService");
class AbstractDbService {
    _dbModel;
    _dbModelName;
    _cloneDeep;
    _joinType = IDbService_1.DB_SERVICE_JOIN_TYPE.NONE;
    _ttlMs = cacheDbService_1.TTL_MS.HOUR;
    _cacheDbService;
    _mongoose;
    _getDbServiceModelViews = () => {
        return {
            defaultView: {},
            adminView: {},
            selfView: {},
            overrideView: {},
        };
    };
    findOne = async (props) => {
        const { searchQuery, dbServiceAccessOptions, session } = props;
        const { modelView, modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
        const cacheKey = this._getCacheKey({
            searchQuery,
            modelViewName,
            cacheClient: IDbService_1.DB_SERVICE_CACHE_CLIENT.FIND_ONE,
        });
        this._testAccessPermitted(dbServiceAccessOptions);
        const cacheData = await this._getCacheData(cacheKey);
        const dbQueryPromise = this._dbModel.findOne(searchQuery, modelView).session(session).lean();
        const storedData = await this._handleStoredData({
            cacheKey,
            cacheData,
            dbQueryPromise,
            dbServiceAccessOptions,
        });
        return storedData;
    };
    _getDbServiceModelView = (dbServiceAccessOptions) => {
        const { isSelf, currentAPIUserRole, isOverrideView } = dbServiceAccessOptions || {};
        const { defaultView, selfView, adminView, overrideView } = this._getDbServiceModelViews();
        const isAdmin = currentAPIUserRole == 'admin';
        const dbServiceModelView = {
            modelView: defaultView,
            modelViewName: IDbService_1.DB_SERVICE_MODEL_VIEW.DEFAULT,
        };
        if (isSelf) {
            dbServiceModelView.modelView = selfView;
            dbServiceModelView.modelViewName = IDbService_1.DB_SERVICE_MODEL_VIEW.SELF;
        }
        if (isAdmin) {
            dbServiceModelView.modelView = adminView;
            dbServiceModelView.modelViewName = IDbService_1.DB_SERVICE_MODEL_VIEW.ADMIN;
        }
        if (isOverrideView) {
            dbServiceModelView.modelView = overrideView;
            dbServiceModelView.modelViewName = IDbService_1.DB_SERVICE_MODEL_VIEW.OVERRIDE;
        }
        if (!dbServiceModelView.modelView) {
            dbServiceModelView.modelView = defaultView;
            dbServiceModelView.modelViewName = IDbService_1.DB_SERVICE_MODEL_VIEW.DEFAULT;
        }
        return dbServiceModelView;
    };
    _getCacheKey = (props) => {
        const { searchQuery, modelViewName, cacheClient } = props;
        return `${this._dbModelName}-${cacheClient}-${JSON.stringify(searchQuery)}-${modelViewName}`;
    };
    _testAccessPermitted = (dbServiceAccessOptions) => {
        const { isCurrentAPIUserPermitted } = dbServiceAccessOptions;
        if (!isCurrentAPIUserPermitted) {
            throw new Error('Access denied.');
        }
    };
    _getCacheData = async (cacheKey) => {
        const cacheData = await this._cacheDbService.get({ hashKey: this._dbModelName, key: cacheKey });
        return cacheData;
    };
    _handleStoredData = async (props) => {
        const { cacheKey, cacheData, dbQueryPromise, dbServiceAccessOptions } = props;
        if (cacheData) {
            return cacheData;
        }
        else {
            const dbQueryResult = await this._getDbQueryResult({
                dbServiceAccessOptions,
                dbQueryPromise,
            });
            await this._setCacheData({ hashKey: this._dbModelName, cacheKey, dbQueryResult });
            return dbQueryResult;
        }
    };
    _getDbQueryResult = async (props) => {
        const { dbServiceAccessOptions, dbQueryPromise } = props;
        let dbQueryResult = await this._executeQuery({ dbQueryPromise });
        const hasJoin = this._joinType != IDbService_1.DB_SERVICE_JOIN_TYPE.NONE;
        const isResultArray = Array.isArray(dbQueryResult);
        const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
        if (hasJoin && isResultArray) {
            const mappedQueryResult = dbQueryResult.map(async (dbDoc) => {
                return await this._joinDbDoc({ dbDoc, modelView });
            });
            dbQueryResult = await Promise.all(mappedQueryResult);
        }
        else if (hasJoin && !isResultArray) {
            dbQueryResult = await this._joinDbDoc({ dbDoc: dbQueryResult, modelView });
        }
        return dbQueryResult;
    };
    _executeQuery = async (props) => {
        const { dbQueryPromise } = props;
        const dbQueryResult = await dbQueryPromise.then((doc) => {
            return doc;
        });
        return dbQueryResult;
    };
    _joinDbDoc = async (props) => {
        const { dbDoc, modelView } = props;
        const dbDocCopy = this._cloneDeep(dbDoc);
        if (dbDocCopy) {
            const dbServiceAccessOptions = this.getBaseDbServiceAccessOptions();
            const computedProps = await this._getComputedProps({
                dbDoc: dbDocCopy,
                dbServiceAccessOptions,
            });
            for (const computedProp in computedProps) {
                const foreignKeyIdName = computedProp.replace(/Data/i, 'Id');
                const isRestrictedProp = modelView[foreignKeyIdName] == 0;
                if (!isRestrictedProp) {
                    const computedData = computedProps[computedProp];
                    dbDocCopy[computedProp] = computedData;
                }
            }
        }
        return dbDocCopy;
    };
    getBaseDbServiceAccessOptions = () => {
        const dbServiceAccessOptions = {
            isCurrentAPIUserPermitted: true,
            currentAPIUserRole: 'user',
            isSelf: false,
        };
        return dbServiceAccessOptions;
    };
    _getComputedProps = async (props) => {
        return {};
    };
    _setCacheData = async (props) => {
        const { hashKey, cacheKey, dbQueryResult } = props;
        await this._cacheDbService.set({
            hashKey,
            key: cacheKey,
            value: dbQueryResult,
            ttlMs: this._ttlMs,
        });
    };
    _getDbDataById = async (props) => {
        const { dbService, _id, dbServiceAccessOptions } = props;
        const dbData = await dbService.findById({ _id, dbServiceAccessOptions });
        return dbData;
    };
    getOverrideDbServiceAccessOptions = () => {
        const dbServiceAccessOptions = {
            isCurrentAPIUserPermitted: true,
            currentAPIUserRole: 'user',
            isSelf: false,
            isOverrideView: true,
        };
        return dbServiceAccessOptions;
    };
    getSelfDbServiceAccessOptions = () => {
        const dbServiceAccessOptions = {
            isCurrentAPIUserPermitted: true,
            currentAPIUserRole: 'user',
            isSelf: true,
            isOverrideView: false,
        };
        return dbServiceAccessOptions;
    };
    _clearCacheDependents = async (collectionName) => {
        const cacheDependencies = this._getCacheDependents();
        const collectionDependents = cacheDependencies[collectionName];
        const seenCollections = [];
        const hasSeenCollection = !seenCollections.includes(collectionName);
        if (hasSeenCollection) {
            await this._cacheDbService.clearHashKey(collectionName);
            seenCollections.push(collectionName);
            for (const dependentCollectionName of collectionDependents) {
                this._clearCacheDependents(dependentCollectionName);
            }
        }
    };
    _getCacheDependents = () => {
        const CACHE_DEPENDENTS = {
            [IDbService_1.DB_SERVICE_COLLECTION.USERS]: [IDbService_1.DB_SERVICE_COLLECTION.PACKAGE_TRANSACTIONS],
            [IDbService_1.DB_SERVICE_COLLECTION.TEACHERS]: [IDbService_1.DB_SERVICE_COLLECTION.USERS],
            [IDbService_1.DB_SERVICE_COLLECTION.PACKAGES]: [
                IDbService_1.DB_SERVICE_COLLECTION.TEACHERS,
                IDbService_1.DB_SERVICE_COLLECTION.PACKAGE_TRANSACTIONS,
            ],
            [IDbService_1.DB_SERVICE_COLLECTION.PACKAGE_TRANSACTIONS]: [
                IDbService_1.DB_SERVICE_COLLECTION.APPOINTMENTS,
                IDbService_1.DB_SERVICE_COLLECTION.BALANCE_TRANSACTIONS,
            ],
            [IDbService_1.DB_SERVICE_COLLECTION.APPOINTMENTS]: [],
            [IDbService_1.DB_SERVICE_COLLECTION.BALANCE_TRANSACTIONS]: [],
            [IDbService_1.DB_SERVICE_COLLECTION.AVAILABLE_TIMES]: [],
            [IDbService_1.DB_SERVICE_COLLECTION.INCOME_REPORT]: [],
        };
        return CACHE_DEPENDENTS;
    };
    findById = async (props) => {
        const { _id, dbServiceAccessOptions, session } = props;
        const { modelView, modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
        const cacheKey = this._getCacheKey({
            searchQuery: { _id },
            modelViewName,
            cacheClient: IDbService_1.DB_SERVICE_CACHE_CLIENT.FIND_BY_ID,
        });
        this._testAccessPermitted(dbServiceAccessOptions);
        const cacheData = await this._getCacheData(cacheKey);
        const dbQueryPromise = this._dbModel.findById(_id, modelView).session(session).lean();
        const storedData = await this._handleStoredData({
            cacheKey,
            cacheData,
            dbQueryPromise,
            dbServiceAccessOptions,
        });
        return storedData;
    };
    find = async (props) => {
        const { searchQuery, paginationOptions, dbServiceAccessOptions, session } = props;
        const { modelView, modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
        const { page, limit, sort } = paginationOptions || {
            page: 0,
            limit: 20,
            sort: {},
        };
        const cacheKey = this._getCacheKey({
            searchQuery: { ...searchQuery, paginationOptions },
            modelViewName,
            cacheClient: IDbService_1.DB_SERVICE_CACHE_CLIENT.FIND,
        });
        this._testAccessPermitted(dbServiceAccessOptions);
        const cacheData = await this._getCacheData(cacheKey);
        const dbQueryPromise = this._dbModel
            .find(searchQuery, modelView)
            .skip(page * limit)
            .limit(limit)
            .session(session)
            .sort(sort)
            .lean();
        const storedData = await this._handleStoredData({
            cacheKey,
            cacheData,
            dbQueryPromise,
            dbServiceAccessOptions,
        });
        return storedData;
    };
    countDocuments = async (props) => {
        const { searchQuery, dbServiceAccessOptions, session } = props;
        const { modelViewName } = this._getDbServiceModelView(dbServiceAccessOptions);
        const cacheKey = this._getCacheKey({
            searchQuery,
            modelViewName,
            cacheClient: IDbService_1.DB_SERVICE_CACHE_CLIENT.FIND,
        });
        this._testAccessPermitted(dbServiceAccessOptions);
        const cacheData = await this._getCacheData(cacheKey);
        const dbQueryPromise = this._dbModel.countDocuments(searchQuery).session(session);
        const storedData = await this._handleStoredData({
            cacheKey,
            cacheData,
            dbQueryPromise,
            dbServiceAccessOptions,
        });
        return storedData;
    };
    insert = async (props) => {
        const { modelToInsert, dbServiceAccessOptions, session, preserveCache } = props;
        this._testAccessPermitted(dbServiceAccessOptions);
        let dbQueryResult;
        if (!session) {
            const insertedModel = await this._dbModel.create(modelToInsert).then((doc) => {
                return doc.toObject(); // lean
            });
            // return findById result rather than insertedModel to ensure caller gets correct modelView/joined document
            dbQueryResult = await this.findById({ _id: insertedModel._id, dbServiceAccessOptions });
        }
        else {
            const insertedModel = await this.insertMany({
                modelToInsert: [modelToInsert],
                dbServiceAccessOptions,
                session,
            });
            dbQueryResult = await this.findById({
                _id: insertedModel[0]._id,
                dbServiceAccessOptions,
            });
        }
        await this._clearCacheBrancher(preserveCache);
        return dbQueryResult;
    };
    insertMany = async (props) => {
        const { modelToInsert, dbServiceAccessOptions, session, preserveCache } = props;
        const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
        this._testAccessPermitted(dbServiceAccessOptions);
        const dbQueryPromise = this._dbModel.insertMany(modelToInsert, modelView, {
            lean: true,
            session,
        });
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
        });
        await this._clearCacheBrancher(preserveCache);
        return dbQueryResult;
    };
    findOneAndUpdate = async (props) => {
        const { searchQuery, updateQuery, dbServiceAccessOptions, session, queryOptions, preserveCache, } = props;
        const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
        this._testAccessPermitted(dbServiceAccessOptions);
        const dbQueryPromise = this._dbModel
            .findOneAndUpdate(searchQuery, { ...updateQuery, lastModifiedDate: new Date() }, {
            fields: modelView,
            new: true,
            ...queryOptions,
        })
            .session(session)
            .lean();
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
        });
        await this._clearCacheBrancher(preserveCache);
        return dbQueryResult;
    };
    _clearCacheBrancher = async (preserveCache) => {
        if (!this._dbModelName || preserveCache) {
            return;
        }
        if (!constants_1.IS_PRODUCTION) {
            await this._clearCacheDependents(this._dbModelName);
        }
        else {
            this._clearCacheDependents(this._dbModelName);
        }
    };
    updateMany = async (props) => {
        const { searchQuery, updateQuery, dbServiceAccessOptions, queryOptions, session, preserveCache, } = props;
        const { modelView } = this._getDbServiceModelView(dbServiceAccessOptions);
        this._testAccessPermitted(dbServiceAccessOptions);
        const dbQueryPromise = this._dbModel
            .updateMany(searchQuery, { ...updateQuery, lastModifiedDate: new Date() }, {
            fields: modelView,
            new: true,
            ...queryOptions,
        })
            .session(session)
            .lean();
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
        });
        await this._clearCacheBrancher(preserveCache);
        return dbQueryResult;
    };
    findByIdAndDelete = async (props) => {
        const { _id, dbServiceAccessOptions, session, preserveCache } = props;
        this._testAccessPermitted(dbServiceAccessOptions);
        const dbQueryPromise = this._dbModel.findByIdAndDelete(_id).session(session).lean();
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
        });
        await this._clearCacheBrancher(preserveCache);
        return dbQueryResult;
    };
    findOneAndDelete = async (props) => {
        const { searchQuery, dbServiceAccessOptions, session, preserveCache } = props;
        this._testAccessPermitted(dbServiceAccessOptions);
        const dbQueryPromise = this._dbModel.findOneAndDelete(searchQuery).session(session).lean();
        const dbQueryResult = await this._getDbQueryResult({
            dbServiceAccessOptions,
            dbQueryPromise,
        });
        await this._clearCacheBrancher(preserveCache);
        return dbQueryResult;
    };
    startSession = async () => {
        const session = await this._mongoose.startSession();
        return session;
    };
    init = async (initParams) => {
        const { mongoose, cloneDeep, dbModel, makeCacheDbService, ...optionalDbServiceInitParams } = initParams;
        this._mongoose = mongoose;
        this._cloneDeep = cloneDeep;
        this._dbModel = dbModel;
        this._dbModelName = this._dbModel ? this._dbModel.collection.collectionName : '';
        this._cacheDbService = await makeCacheDbService;
        await this._initTemplate(optionalDbServiceInitParams);
        return this;
    };
    _initTemplate = async (optionalDbServiceInitParams) => {
        return;
    };
    getDbServiceModelViews = () => {
        const dbServiceModelViews = this._getDbServiceModelViews();
        const dbModelViewsCopy = this._cloneDeep(dbServiceModelViews);
        return dbModelViewsCopy;
    };
}
exports.AbstractDbService = AbstractDbService;
