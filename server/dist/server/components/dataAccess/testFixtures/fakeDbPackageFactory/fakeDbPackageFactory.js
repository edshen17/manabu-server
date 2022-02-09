"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeDbPackageFactory = void 0;
const packageEntity_1 = require("../../../entities/package/packageEntity");
const AbstractFakeDbDataFactory_1 = require("../abstractions/AbstractFakeDbDataFactory");
class FakeDbPackageFactory extends AbstractFakeDbDataFactory_1.AbstractFakeDbDataFactory {
    _createFakeBuildParams = async () => {
        const fakeBuildParams = {
            lessonAmount: 5,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.DEFAULT,
            name: packageEntity_1.PACKAGE_ENTITY_NAME.LIGHT,
            isOffering: true,
            lessonDurations: [30, 60],
        };
        return fakeBuildParams;
    };
    createFakePackages = async () => {
        const fakePackages = this._createFakePackages();
        return fakePackages;
    };
    _createFakePackages = () => {
        const lightPackage = this._entity.build({
            lessonAmount: 5,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.DEFAULT,
            name: packageEntity_1.PACKAGE_ENTITY_NAME.LIGHT,
            isOffering: true,
            lessonDurations: [30, 60],
        });
        const moderatePackage = this._entity.build({
            lessonAmount: 12,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.DEFAULT,
            name: packageEntity_1.PACKAGE_ENTITY_NAME.MODERATE,
            isOffering: true,
            lessonDurations: [30, 60],
        });
        const mainichiPackage = this._entity.build({
            lessonAmount: 22,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.DEFAULT,
            name: packageEntity_1.PACKAGE_ENTITY_NAME.MAINICHI,
            isOffering: true,
            lessonDurations: [30, 60],
        });
        const customPackage = this._entity.build({
            lessonAmount: 6,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.CUSTOM,
            name: 'custom package name',
            isOffering: true,
            lessonDurations: [30, 60, 90],
        });
        return [lightPackage, moderatePackage, mainichiPackage, customPackage];
    };
}
exports.FakeDbPackageFactory = FakeDbPackageFactory;
