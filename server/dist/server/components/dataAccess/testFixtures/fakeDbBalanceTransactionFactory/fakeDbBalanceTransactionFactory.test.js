"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const balanceTransactionEntity_1 = require("../../../entities/balanceTransaction/balanceTransactionEntity");
const fakeDbPackageTransactionFactory_1 = require("../fakeDbPackageTransactionFactory");
let fakeDbBalanceTransactionFactory;
let fakeDbPackageTransactionFactory;
let fakePackageTransaction;
before(async () => {
    fakeDbBalanceTransactionFactory = await _1.makeFakeDbBalanceTransactionFactory;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
});
beforeEach(async () => {
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
});
describe('fakeDbBalanceTransactionFactory', () => {
    describe('createFakeDbData', () => {
        it('should create a fake balanceTransaction using data from a fake teacher', async () => {
            const fakeBalanceTransaction = await fakeDbBalanceTransactionFactory.createFakeDbData();
            (0, chai_1.expect)(fakeBalanceTransaction._id.toString().length).to.equal(24);
        });
        it('should create a fake balanceTransaction using data from the given fake users', async () => {
            const fakeBalanceTransaction = await fakeDbBalanceTransactionFactory.createFakeDbData({
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
            });
            (0, chai_1.expect)(fakeBalanceTransaction._id.toString().length).to.equal(24);
        });
    });
});
