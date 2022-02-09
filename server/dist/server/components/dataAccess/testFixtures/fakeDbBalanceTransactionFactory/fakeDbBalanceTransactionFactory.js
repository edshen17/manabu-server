"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeDbBalanceTransactionFactory = void 0;
const balanceTransactionEntity_1 = require("../../../entities/balanceTransaction/balanceTransactionEntity");
const AbstractFakeDbDataFactory_1 = require("../abstractions/AbstractFakeDbDataFactory");
class FakeDbBalanceTransactionFactory extends AbstractFakeDbDataFactory_1.AbstractFakeDbDataFactory {
    _fakeDbPackageTransactionFactory;
    _createFakeBuildParams = async () => {
        const fakePackageTransaction = await this._fakeDbPackageTransactionFactory.createFakeDbData();
        const fakeBuildParams = {
            userId: fakePackageTransaction.hostedById,
            status: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_STATUS.PENDING,
            currency: 'SGD',
            type: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
            packageTransactionId: fakePackageTransaction._id,
            balanceChange: 100,
            processingFee: 5,
            tax: 0.2,
            runningBalance: {
                currency: 'SGD',
                totalAvailable: 0,
            },
            paymentData: {
                gateway: 'paypal',
                id: 'some id',
            },
        };
        return fakeBuildParams;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeFakeDbPackageTransactionFactory } = optionalInitParams;
        this._fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
    };
}
exports.FakeDbBalanceTransactionFactory = FakeDbBalanceTransactionFactory;
