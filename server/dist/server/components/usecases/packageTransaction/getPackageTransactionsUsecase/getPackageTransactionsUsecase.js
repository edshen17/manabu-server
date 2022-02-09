"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPackageTransactionsUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class GetPackageTransactionsUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
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
        const { currentAPIUser, endpointPath, params, dbServiceAccessOptions, query } = props;
        const { role } = currentAPIUser;
        const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
        const userId = isSelf ? currentAPIUser.userId : params.userId;
        const packageTransactions = await this._getPackageTransactions({
            userId,
            query,
            dbServiceAccessOptions,
        });
        const isAccessUnathorized = params.userId && role != 'admin';
        if (!packageTransactions) {
            throw new Error('Package transactions not found.');
        }
        if (isAccessUnathorized) {
            throw new Error('Access denied.');
        }
        return { packageTransactions };
    };
    _getPackageTransactions = async (props) => {
        const { userId, query, dbServiceAccessOptions } = props;
        const searchQuery = this._processQuery({ query, userId });
        const fallbackQuery = { page: 0, limit: 15 };
        const sort = { createdDate: 1 };
        const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
        const packageTransactions = await this._dbService.find({
            searchQuery,
            dbServiceAccessOptions,
            paginationOptions,
        });
        return packageTransactions;
    };
    _processQuery = (props) => {
        const { userId, query } = props;
        const { startDate, endDate } = query;
        const searchQuery = {
            $or: [
                {
                    reservedById: userId,
                },
                {
                    hostedById: userId,
                },
            ],
        };
        if (startDate) {
            searchQuery.startDate = { $gte: startDate };
        }
        if (endDate) {
            searchQuery.endDate = { $lte: endDate };
        }
        return searchQuery;
    };
}
exports.GetPackageTransactionsUsecase = GetPackageTransactionsUsecase;
