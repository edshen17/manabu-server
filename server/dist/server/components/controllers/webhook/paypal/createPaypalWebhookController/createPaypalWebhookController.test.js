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
let createPaypalWebhookController;
let fakePackageTransactionCheckoutTokenHandler;
before(async () => {
    createPaypalWebhookController = await _1.makeCreatePaypalWebhookController;
    fakePackageTransactionCheckoutTokenHandler = await fakePackageTransactionCheckoutTokenHandler_1.makeFakePackageTransactionCheckoutTokenHandler;
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
});
beforeEach(async () => {
    const tokenData = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
    token = tokenData.token;
    currentAPIUser = tokenData.currentAPIUser;
    body = {
        event_type: 'PAYMENTS.PAYMENT.CREATED',
        resource: {
            transactions: [
                {
                    custom: token,
                },
            ],
        },
        id: 'WH-7Y7254563A4550640-11V2185806837105M',
    };
});
describe('createPaypalWebhookController', () => {
    describe('makeRequest', () => {
        const createPaypalWebhook = async () => {
            const createPaypalWebhookHttpRequest = iHttpRequestBuilder
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const createPaypalWebhookRes = await createPaypalWebhookController.makeRequest(createPaypalWebhookHttpRequest);
            return createPaypalWebhookRes;
        };
        const testValidPaypalWebhook = async () => {
            const paypalWebhookRes = await createPaypalWebhook();
            (0, chai_1.expect)(paypalWebhookRes.statusCode).to.equal(201);
            (0, chai_1.expect)(paypalWebhookRes.body).to.have.property('packageTransaction');
        };
        const testInvalidPaypalWebhook = async () => {
            const paypalWebhookRes = await createPaypalWebhook();
            (0, chai_1.expect)(paypalWebhookRes.statusCode).to.equal(409);
        };
        context('valid inputs', () => {
            it('should create a package transaction', async () => {
                await testValidPaypalWebhook();
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if http request is invalid', async () => {
                body = {};
                await testInvalidPaypalWebhook();
            });
        });
    });
});
