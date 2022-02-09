"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFakeDbEmbeddedDataFactory = void 0;
class AbstractFakeDbEmbeddedDataFactory {
    _entity;
    createFakeData = async () => {
        const fakeBuildParams = await this._createFakeBuildParams();
        const fakeData = this._entity.build(fakeBuildParams);
        return fakeData;
    };
    init = async (props) => {
        const { makeEntity, ...optionalInitParams } = props;
        this._entity = await makeEntity;
        await this._initTemplate(optionalInitParams);
        return this;
    };
    _initTemplate = async (optionalInitParams) => {
        return;
    };
}
exports.AbstractFakeDbEmbeddedDataFactory = AbstractFakeDbEmbeddedDataFactory;
