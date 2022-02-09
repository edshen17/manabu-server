"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFakeDbDataFactory = void 0;
class AbstractFakeDbDataFactory {
    _entity;
    _dbService;
    _cloneDeep;
    createFakeDbData = async (buildParams, isOverrideView) => {
        const fakeBuildParams = buildParams || (await this._createFakeBuildParams());
        const fakeEntity = await this._entity.build(fakeBuildParams);
        const dbServiceAccessOptions = isOverrideView
            ? this._dbService.getOverrideDbServiceAccessOptions()
            : this._dbService.getBaseDbServiceAccessOptions();
        const fakeDbData = await this._dbService.insert({
            modelToInsert: fakeEntity,
            dbServiceAccessOptions,
        });
        return fakeDbData;
    };
    init = async (initParams) => {
        const { makeEntity, makeDbService, cloneDeep, ...optionalInitParams } = initParams;
        this._entity = await makeEntity;
        this._dbService = await makeDbService;
        this._cloneDeep = cloneDeep;
        await this._initTemplate(optionalInitParams);
        return this;
    };
    _initTemplate = async (optionalInitParams) => {
        return;
    };
}
exports.AbstractFakeDbDataFactory = AbstractFakeDbDataFactory;
