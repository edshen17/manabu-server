"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const constants_1 = require("../../../../../constants");
const stripe_1 = require("../../../../payment/services/stripe");
const fakePackageTransactionCheckoutTokenHandler_1 = require("../../../../usecases/utils/fakePackageTransactionCheckoutTokenHandler");
const iHttpRequestBuilder_1 = require("../../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let currentAPIUser;
let rawBody;
let token;
let createStripeWebhookController;
let fakePackageTransactionCheckoutTokenHandler;
before(async () => {
    createStripeWebhookController = await _1.makeCreateStripeWebhookController;
    fakePackageTransactionCheckoutTokenHandler = await fakePackageTransactionCheckoutTokenHandler_1.makeFakePackageTransactionCheckoutTokenHandler;
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
});
beforeEach(async () => {
    const tokenData = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
    token = tokenData.token;
    currentAPIUser = tokenData.currentAPIUser;
});
describe('createStripeWebhookController', () => {
    describe('makeRequest', () => {
        const createStripeWebhook = async () => {
            const payload = {
                id: 'evt_test_webhook',
                object: 'event',
                type: 'payment_intent.succeeded',
                data: {
                    object: {
                        id: 'pi_3JrSNXEQ9HTqnQXA0eEZG7gb',
                        charges: {
                            data: [
                                {
                                    metadata: {
                                        token,
                                    },
                                },
                            ],
                        },
                    },
                },
            };
            const payloadString = JSON.stringify(payload, null, 2);
            const secret = constants_1.STRIPE_WEBHOOK_SECREY_KEY_DEV;
            const stripeHeader = stripe_1.stripe.webhooks.generateTestHeaderString({
                payload: payloadString,
                secret,
            });
            rawBody = {
                payloadString,
            };
            const createStripeWebhookHttpRequest = iHttpRequestBuilder
                .rawBody(rawBody)
                .currentAPIUser(currentAPIUser)
                .headers({
                'stripe-signature': stripeHeader,
            })
                .build();
            const createStripeWebhookRes = await createStripeWebhookController.makeRequest(createStripeWebhookHttpRequest);
            return createStripeWebhookRes;
        };
        const testValidStripeWebhook = async () => {
            const stripeWebhookRes = await createStripeWebhook();
            (0, chai_1.expect)(stripeWebhookRes.statusCode).to.equal(201);
            (0, chai_1.expect)(stripeWebhookRes.body).to.have.property('packageTransaction');
        };
        context('valid inputs', () => {
            it('should create a package transaction', async () => {
                await testValidStripeWebhook();
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if http request is invalid', async () => {
                const createStripeWebhookHttpRequest = iHttpRequestBuilder
                    .rawBody(rawBody)
                    .currentAPIUser(currentAPIUser)
                    .build();
                const createStripeWebhookRes = await createStripeWebhookController.makeRequest(createStripeWebhookHttpRequest);
                (0, chai_1.expect)(createStripeWebhookRes.statusCode).to.equal(409);
            });
        });
    });
});
