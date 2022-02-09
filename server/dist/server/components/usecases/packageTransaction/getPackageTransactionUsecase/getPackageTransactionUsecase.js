"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPackageTransactionUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class GetPackageTransactionUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
    _isProtectedResource = () => {
        return true;
    };
    _getResourceAccessData = () => {
        return {
            hasResourceAccessCheck: true,
            paramIdName: 'packageTransactionId',
        };
    };
    _makeRequestTemplate = async (props) => {
        const { params, dbServiceAccessOptions } = props;
        const { packageTransactionId } = params;
        const packageTransaction = await this._getPackageTransaction({
            packageTransactionId,
            dbServiceAccessOptions,
        });
        if (!packageTransaction) {
            throw new Error('Package transaction not found.');
        }
        return { packageTransaction };
    };
    _getPackageTransaction = async (props) => {
        const { packageTransactionId, dbServiceAccessOptions } = props;
        const packageTransaction = await this._dbService.findById({
            _id: packageTransactionId,
            dbServiceAccessOptions,
        });
        return packageTransaction;
    };
}
exports.GetPackageTransactionUsecase = GetPackageTransactionUsecase;
