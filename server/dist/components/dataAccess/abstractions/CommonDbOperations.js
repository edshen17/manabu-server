"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonDbOperations = void 0;
class CommonDbOperations {
    constructor(dbModel) {
        this._configureSelectOptions = (accessOptions) => {
            const { isSelf, currentAPIUserRole } = accessOptions;
            const { defaultSettings, adminSettings, isSelfSettings } = this.defaultSelectOptions;
            let selectOptions = defaultSettings;
            if (isSelf) {
                selectOptions = isSelfSettings;
            }
            if (currentAPIUserRole == 'admin') {
                selectOptions = adminSettings;
            }
            return selectOptions || defaultSettings;
        };
        this._grantAccess = async (accessOptions, asyncCallback) => {
            try {
                let dbResult;
                const { isProtectedResource, isCurrentAPIUserPermitted } = accessOptions;
                const isAccessPermitted = (isProtectedResource && isCurrentAPIUserPermitted) || !isProtectedResource;
                if (isAccessPermitted) {
                    dbResult = await asyncCallback;
                    return dbResult;
                }
                else if (isAccessPermitted && !dbResult) {
                    throw new Error(`${this.dbModel.collection.collectionName} was not found.`);
                }
                else {
                    throw new Error('Access denied.');
                }
            }
            catch (err) {
                throw err;
            }
        };
        this._dbReturnTemplate = async (accessOptions, asyncCallback) => {
            return await this._grantAccess(accessOptions, asyncCallback);
        };
        this.findOne = async (params) => {
            const { searchQuery, accessOptions } = params;
            const selectOptions = this._configureSelectOptions(accessOptions);
            const asyncCallback = this.dbModel.findOne(searchQuery, selectOptions).lean();
            return await this._dbReturnTemplate(accessOptions, asyncCallback);
        };
        this.findById = async (params) => {
            const { _id, accessOptions } = params;
            const selectOptions = this._configureSelectOptions(accessOptions);
            const asyncCallback = this.dbModel.findById(_id, selectOptions).lean();
            return await this._dbReturnTemplate(accessOptions, asyncCallback);
        };
        this.find = async (params) => {
            const { searchQuery, accessOptions } = params;
            const selectOptions = this._configureSelectOptions(accessOptions);
            const asyncCallback = this.dbModel.find(searchQuery, selectOptions).lean();
            return await this._dbReturnTemplate(accessOptions, asyncCallback);
        };
        this.insert = async (params) => {
            const { modelToInsert, accessOptions } = params;
            const selectOptions = this._configureSelectOptions(accessOptions);
            const insertedModel = await this.dbModel.create(modelToInsert);
            const asyncCallback = await this.dbModel.findById(insertedModel._id, selectOptions).lean();
            return await this._dbReturnTemplate(accessOptions, asyncCallback);
        };
        this.update = async (params) => {
            const { searchQuery, updateParams, accessOptions } = params;
            const selectOptions = this._configureSelectOptions(accessOptions);
            const asyncCallback = this.dbModel
                .findOneAndUpdate(searchQuery, updateParams, {
                fields: selectOptions,
                new: true,
            })
                .lean();
            return await this._dbReturnTemplate(accessOptions, asyncCallback);
        };
        this.updateMany = async (params) => {
            const { searchQuery, updateParams, accessOptions } = params;
            const selectOptions = this._configureSelectOptions(accessOptions);
            const asyncCallback = this.dbModel
                .updateMany(searchQuery, updateParams, {
                fields: selectOptions,
                new: true,
            })
                .lean();
            return await this._dbReturnTemplate(accessOptions, asyncCallback);
        };
        this.init = async (props) => {
            await props.makeDb();
            return this;
        };
        this.dbModel = dbModel;
    }
}
exports.CommonDbOperations = CommonDbOperations;
