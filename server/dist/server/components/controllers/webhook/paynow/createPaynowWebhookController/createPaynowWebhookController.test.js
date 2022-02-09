"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakePackageTransactionCheckoutTokenHandler_1 = require("../../../../usecases/utils/fakePackageTransactionCheckoutTokenHandler");
const iHttpRequestBuilder_1 = require("../../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let currentAPIUser;
let body;
let token;
let createPaynowWebhookController;
let fakePackageTransactionCheckoutTokenHandler;
before(async () => {
    createPaynowWebhookController = await _1.makeCreatePaynowWebhookController;
    fakePackageTransactionCheckoutTokenHandler = await fakePackageTransactionCheckoutTokenHandler_1.makeFakePackageTransactionCheckoutTokenHandler;
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
});
beforeEach(async () => {
    const tokenData = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
    token = tokenData.token;
    currentAPIUser = tokenData.currentAPIUser;
    body = {
        key: 'charge.complete',
        data: {
            id: 'chrg_test_5pquctyn90hobjzd4fd',
            metadata: {
                token,
            },
        },
    };
});
describe('createPaynowWebhookController', () => {
    describe('makeRequest', () => {
        const createPaynowWebhook = async () => {
            const createPaynowWebhookHttpRequest = iHttpRequestBuilder
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const createPaynowWebhookRes = await createPaynowWebhookController.makeRequest(createPaynowWebhookHttpRequest);
            return createPaynowWebhookRes;
        };
        const testValidPaynowWebhook = async () => {
            const paynowWebhookRes = await createPaynowWebhook();
            (0, chai_1.expect)(paynowWebhookRes.statusCode).to.equal(201);
            (0, chai_1.expect)(paynowWebhookRes.body).to.have.property('packageTransaction');
        };
        const testInvalidPaynowWebhook = async () => {
            const paynowWebhookRes = await createPaynowWebhook();
            (0, chai_1.expect)(paynowWebhookRes.statusCode).to.equal(409);
        };
        context('valid inputs', () => {
            it('should create a package transaction', async () => {
                await testValidPaynowWebhook();
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if http request is invalid', async () => {
                body = {};
                await testInvalidPaynowWebhook();
            });
        });
    });
});
