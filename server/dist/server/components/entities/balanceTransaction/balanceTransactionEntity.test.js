"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbPackageTransactionFactory_1 = require("../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const balanceTransactionEntity_1 = require("./balanceTransactionEntity");
let fakeDbPackageTransactionFactory;
let balanceTransactionEntity;
let fakePackageTransaction;
before(async () => {
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    balanceTransactionEntity = await _1.makeBalanceTransactionEntity;
});
beforeEach(async () => {
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
});
context('balanceTransactionEntity', () => {
    describe('build', async () => {
        context('given valid inputs', () => {
            it('should return a balanceTransaction with packageTransaction data', async () => {
                const fakeBalanceTransaction = await balanceTransactionEntity.build({
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
                (0, chai_1.expect)(fakeBalanceTransaction).to.have.property('userId');
            });
        });
        context('given invalid inputs', () => {
            it('should throw an error', async () => {
                let error;
                try {
                    const entityData = {
                        userId: 5,
                    };
                    error = await balanceTransactionEntity.build(entityData);
                }
                catch (err) {
                    return;
                }
                (0, chai_1.expect)(error).to.be.an('error');
            });
        });
    });
});
