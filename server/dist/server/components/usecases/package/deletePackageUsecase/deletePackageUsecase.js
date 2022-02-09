"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePackageUsecase = void 0;
const packageEntity_1 = require("../../../entities/package/packageEntity");
const AbstractDeleteUsecase_1 = require("../../abstractions/AbstractDeleteUsecase");
class DeletePackageUsecase extends AbstractDeleteUsecase_1.AbstractDeleteUsecase {
    _getResourceAccessData = () => {
        return {
            hasResourceAccessCheck: true,
            paramIdName: 'packageId',
        };
    };
    _makeRequestTemplate = async (props) => {
        const { params, dbServiceAccessOptions } = props;
        const { packageId } = params;
        const deletedPackage = await this._deletePackage({
            packageId,
            dbServiceAccessOptions,
        });
        const usecaseRes = {
            package: deletedPackage,
        };
        return usecaseRes;
    };
    _deletePackage = async (props) => {
        const { packageId, dbServiceAccessOptions } = props;
        const packageToDelete = await this._dbService.findById({
            _id: packageId,
            dbServiceAccessOptions,
        });
        const isDefaultPackage = packageToDelete.type == packageEntity_1.PACKAGE_ENTITY_TYPE.DEFAULT;
        if (!isDefaultPackage) {
            const deletedPackage = await this._dbService.findByIdAndDelete({
                _id: packageId,
                dbServiceAccessOptions,
            });
            return deletedPackage;
        }
        throw new Error('You cannot delete a default package.');
    };
}
exports.DeletePackageUsecase = DeletePackageUsecase;
