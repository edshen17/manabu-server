"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditPackageUsecase = void 0;
const packageEntity_1 = require("../../../entities/package/packageEntity");
const AbstractEditUsecase_1 = require("../../abstractions/AbstractEditUsecase");
class EditPackageUsecase extends AbstractEditUsecase_1.AbstractEditUsecase {
    _getResourceAccessData = () => {
        return {
            hasResourceAccessCheck: true,
            paramIdName: 'packageId',
        };
    };
    _makeRequestTemplate = async (props) => {
        const { params, body, dbServiceAccessOptions } = props;
        const { packageId } = params;
        const updatedPackage = await this._editPackage({
            packageId,
            body,
            dbServiceAccessOptions,
        });
        const usecaseRes = {
            package: updatedPackage,
        };
        return usecaseRes;
    };
    _editPackage = async (props) => {
        const { packageId, body, dbServiceAccessOptions } = props;
        const packageToUpdate = await this._dbService.findById({
            _id: packageId,
            dbServiceAccessOptions,
        });
        const { lessonAmount, packageDesc, packageName } = body;
        const isDefaultPackage = packageToUpdate.type == packageEntity_1.PACKAGE_ENTITY_TYPE.DEFAULT;
        const isEditingDefaultPackageRestrictedFields = isDefaultPackage && (lessonAmount || packageDesc || packageName);
        if (!isEditingDefaultPackageRestrictedFields) {
            const updatedPackage = await this._dbService.findOneAndUpdate({
                searchQuery: { _id: packageId },
                updateQuery: body,
                dbServiceAccessOptions,
            });
            return updatedPackage;
        }
        throw new Error('You cannot edit those default fields.');
    };
}
exports.EditPackageUsecase = EditPackageUsecase;
