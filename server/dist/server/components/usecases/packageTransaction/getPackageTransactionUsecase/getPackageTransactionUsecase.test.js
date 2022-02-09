"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let getPackageTransactionUsecase;
let controllerDataBuilder;
let routeData;
let currentAPIUser;
let fakeDbPackageTransactionFactory;
let fakePackageTransaction;
before(async () => {
    getPackageTransactionUsecase = await _1.makeGetPackageTransactionUsecase;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
});
beforeEach(async () => {
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    routeData = {
        rawBody: {},
        headers: {},
        params: {
            packageTransactionId: fakePackageTransaction._id,
        },
        body: {},
        query: {},
        endpointPath: '',
    };
    currentAPIUser = {
        userId: fakePackageTransaction.reservedById,
        role: 'user',
    };
});
describe('getPackageTransactionUsecase', () => {
    describe('makeRequest', () => {
        const getPackageTransaction = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const getPackageTransactionRes = await getPackageTransactionUsecase.makeRequest(controllerData);
            const packageTransaction = getPackageTransactionRes.packageTransaction;
            return packageTransaction;
        };
        const testPackageTransaction = async () => {
            const packageTransactions = await getPackageTransaction();
            (0, chai_1.expect)(packageTransactions._id).to.deep.equal(fakePackageTransaction._id);
        };
        const testPackageTransactionError = async () => {
            let error;
            try {
                await getPackageTransaction();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if an invalid id is given', async () => {
                    routeData.params = {
                        hostedById: fakePackageTransaction.hostedById,
                    };
                    await testPackageTransactionError();
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it("should get the user's packageTransactions", async () => {
                            await testPackageTransaction();
                        });
                    });
                    context('viewing other (as hostedBy)', () => {
                        it("should get the user's packageTransactions", async () => {
                            currentAPIUser.userId = fakePackageTransaction.hostedById;
                            await testPackageTransaction();
                        });
                    });
                    context('as an unlogged-in user', async () => {
                        it('should throw an error', async () => {
                            currentAPIUser.userId = undefined;
                            await testPackageTransactionError();
                        });
                    });
                });
            });
        });
    });
});
