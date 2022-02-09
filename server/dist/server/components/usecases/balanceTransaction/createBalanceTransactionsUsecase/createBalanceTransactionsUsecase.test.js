"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const balanceTransactionEntity_1 = require("../../../entities/balanceTransaction/balanceTransactionEntity");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbPackageTransactionFactory;
let routeData;
let fakePackageTransaction;
let currentAPIUser;
let createBalanceTransactionsUsecase;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createBalanceTransactionsUsecase = await _1.makeCreateBalanceTransactionsUsecase;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
});
beforeEach(async () => {
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    currentAPIUser = {
        userId: fakePackageTransaction.hostedById,
        role: 'user',
    };
    routeData = {
        rawBody: {},
        headers: {},
        params: {},
        body: {
            balanceTransactions: [
                {
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
                },
            ],
        },
        query: {},
        endpointPath: '',
    };
});
describe('createBalanceTransactionsUsecase', () => {
    describe('makeRequest', () => {
        const createBalanceTransactions = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const createBalanceTransactionsRes = await createBalanceTransactionsUsecase.makeRequest(controllerData);
            return createBalanceTransactionsRes;
        };
        const testBalanceTransactionsError = async () => {
            let error;
            try {
                await createBalanceTransactions();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if invalid data is passed', async () => {
                    routeData.body.balanceTransactions[0].paymentData.gateway = 'bad gateway';
                    await testBalanceTransactionsError();
                });
                it('should throw an error if body contains an invalid userId', async () => {
                    routeData.body.balanceTransactions[0].userId = 'bad id';
                    await testBalanceTransactionsError();
                });
                it('should throw an error if user not logged in', async () => {
                    currentAPIUser.userId = undefined;
                    await testBalanceTransactionsError();
                });
                it('should throw an error if at least one balance transaction is invalid', async () => {
                    routeData.body.balanceTransactions.push({});
                    await testBalanceTransactionsError();
                });
            });
            context('valid inputs', () => {
                const validResOutput = async () => {
                    const createBalanceTransactionsRes = await createBalanceTransactions();
                    (0, chai_1.expect)(createBalanceTransactionsRes).to.have.property('balanceTransactions');
                };
                it('should get return a valid balance transaction', async () => {
                    await validResOutput();
                });
            });
        });
    });
});
