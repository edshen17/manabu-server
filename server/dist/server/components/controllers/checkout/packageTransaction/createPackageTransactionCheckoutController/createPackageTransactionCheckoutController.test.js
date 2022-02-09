"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../../dataAccess/testFixtures/fakeDbUserFactory");
const queryStringHandler_1 = require("../../../../usecases/utils/queryStringHandler");
const iHttpRequestBuilder_1 = require("../../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let fakeDbUserFactory;
let fakeUser;
let fakeTeacher;
let currentAPIUser;
let body;
let queryStringHandler;
let queryToEncode;
let query;
let createPackageTransactionCheckoutController;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    queryStringHandler = queryStringHandler_1.makeQueryStringHandler;
    createPackageTransactionCheckoutController = await _1.makeCreatePackageTransactionCheckoutController;
});
beforeEach(async () => {
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    body = {
        teacherId: fakeTeacher.teacherData._id,
        packageId: fakeTeacher.teacherData.packages[0]._id,
        lessonDuration: 60,
        lessonLanguage: 'ja',
    };
    queryToEncode = {
        paymentGateway: 'paypal',
    };
    currentAPIUser = {
        userId: fakeUser._id,
        role: fakeUser.role,
    };
});
describe('createPackageTransactionCheckoutController', () => {
    describe('makeRequest', () => {
        const createPackageTransactionCheckout = async () => {
            const encodedQuery = queryStringHandler.encodeQueryStringObj(queryToEncode);
            query = queryStringHandler.parseQueryString(encodedQuery);
            const createPackageTransactionCheckoutHttpRequest = iHttpRequestBuilder
                .body(body)
                .currentAPIUser(currentAPIUser)
                .query(query)
                .build();
            const createPackageTransactionCheckoutRes = await createPackageTransactionCheckoutController.makeRequest(createPackageTransactionCheckoutHttpRequest);
            return createPackageTransactionCheckoutRes;
        };
        const testValidPackageTransactionCheckout = async () => {
            const createPackageTransactionCheckoutRes = await createPackageTransactionCheckout();
            (0, chai_1.expect)(createPackageTransactionCheckoutRes.statusCode).to.equal(201);
            (0, chai_1.expect)(createPackageTransactionCheckoutRes.body).to.have.property('redirectUrl');
        };
        const testInvalidPackageTransactionCheckout = async () => {
            const createPackageTransactionCheckoutRes = await createPackageTransactionCheckout();
            (0, chai_1.expect)(createPackageTransactionCheckoutRes.statusCode).to.equal(409);
        };
        context('valid inputs', () => {
            context('paypal', () => {
                it('should create a checkout', async () => {
                    await testValidPackageTransactionCheckout();
                });
            });
            context('stripe', () => {
                it('should create a checkout', async () => {
                    queryToEncode.paymentGateway = 'stripe';
                    await testValidPackageTransactionCheckout();
                });
            });
            context('paynow', () => {
                it('should create a checkout', async () => {
                    queryToEncode.paymentGateway = 'paynow';
                    await testValidPackageTransactionCheckout();
                });
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if gateway is invalid', async () => {
                queryToEncode.paymentGateway = 'some unsupported gateway';
                await testInvalidPackageTransactionCheckout();
            });
            it('should throw an error if body is invalid', async () => {
                body.lessonAmount = 99;
                await testInvalidPackageTransactionCheckout();
            });
            it('should throw an error if the user is not logged in', async () => {
                currentAPIUser.userId = undefined;
                await testInvalidPackageTransactionCheckout();
            });
        });
    });
});
