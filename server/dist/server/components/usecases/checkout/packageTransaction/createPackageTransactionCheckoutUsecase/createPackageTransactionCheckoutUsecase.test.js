"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbUserFactory;
let routeData;
let fakeUser;
let fakeTeacher;
let currentAPIUser;
let createPackageTransactionCheckoutUsecase;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createPackageTransactionCheckoutUsecase = await _1.makeCreatePackageTransactionCheckoutUsecase;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
beforeEach(async () => {
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    currentAPIUser = {
        userId: fakeUser._id,
        role: fakeUser.role,
    };
    routeData = {
        rawBody: {},
        headers: {},
        params: {},
        body: {
            teacherId: fakeTeacher.teacherData._id,
            packageId: fakeTeacher.teacherData.packages[0]._id,
            lessonDuration: 60,
            lessonLanguage: 'ja',
        },
        query: {
            paymentGateway: 'paypal',
        },
        endpointPath: '',
    };
});
describe('createPackageTransactionCheckoutUsecase', () => {
    describe('makeRequest', () => {
        const createPackageTransactionCheckout = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const createPackageTransactionCheckoutRes = await createPackageTransactionCheckoutUsecase.makeRequest(controllerData);
            return createPackageTransactionCheckoutRes;
        };
        const testPackageTransactionCheckoutError = async () => {
            let error;
            try {
                await createPackageTransactionCheckout();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if invalid data is passed', async () => {
                    const routeDataBody = routeData.body;
                    routeDataBody.hostedById = 'some id';
                    routeDataBody.createdDate = new Date();
                    await testPackageTransactionCheckoutError();
                });
                it('should throw an error if body contains an invalid userId', async () => {
                    routeData.body.teacherId = 'bad id';
                    await testPackageTransactionCheckoutError();
                });
                it('should throw an error if user not logged in', async () => {
                    currentAPIUser.userId = undefined;
                    await testPackageTransactionCheckoutError();
                });
            });
            context('valid inputs', () => {
                const validResOutput = async () => {
                    const createPackageTransactionCheckoutRes = await createPackageTransactionCheckout();
                    (0, chai_1.expect)(createPackageTransactionCheckoutRes).to.have.property('redirectUrl');
                    (0, chai_1.expect)(createPackageTransactionCheckoutRes).to.have.property('token');
                };
                context('one-time payment', () => {
                    context('paypal', () => {
                        it('should get a valid checkout link', async () => {
                            await validResOutput();
                        });
                    });
                    context('stripe', () => {
                        it('should get a valid checkout link', async () => {
                            routeData.query.paymentGateway = 'stripe';
                            await validResOutput();
                        });
                    });
                    context('paynow', () => {
                        it('should get a valid checkout link', async () => {
                            routeData.query.paymentGateway = 'paynow';
                            await validResOutput();
                        });
                    });
                });
            });
        });
    });
});
