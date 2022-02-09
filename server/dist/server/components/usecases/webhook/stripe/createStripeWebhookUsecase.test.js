"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const constants_1 = require("../../../../constants");
const stripe_1 = require("../../../payment/services/stripe");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
const fakePackageTransactionCheckoutTokenHandler_1 = require("../../utils/fakePackageTransactionCheckoutTokenHandler");
let controllerDataBuilder;
let createStripeWebhookUsecase;
let routeData;
let currentAPIUser;
let fakePackageTransactionCheckoutTokenHandler;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createStripeWebhookUsecase = await _1.makeCreateStripeWebhookUsecase;
    fakePackageTransactionCheckoutTokenHandler = await fakePackageTransactionCheckoutTokenHandler_1.makeFakePackageTransactionCheckoutTokenHandler;
});
beforeEach(async () => {
    const tokenData = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
    const { token } = tokenData;
    currentAPIUser = tokenData.currentAPIUser;
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
    routeData = {
        rawBody: {
            payloadString,
        },
        params: {},
        body: {},
        query: {},
        endpointPath: '',
        headers: {
            'stripe-signature': stripeHeader,
        },
    };
});
describe('createStripeWebhookUsecase', () => {
    describe('makeRequest', () => {
        const createStripeWebhook = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const createStripeWebhookRes = await createStripeWebhookUsecase.makeRequest(controllerData);
            return createStripeWebhookRes;
        };
        const testStripeWebhookError = async () => {
            let error;
            try {
                error = await createStripeWebhook();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('packageTransaction', () => {
            context('successful payment', () => {
                const validResOutput = (createStripeWebhookRes) => {
                    const packageTransaction = createStripeWebhookRes.packageTransaction;
                    (0, chai_1.expect)(packageTransaction).to.have.property('_id');
                    (0, chai_1.expect)(packageTransaction).to.have.property('hostedById');
                    (0, chai_1.expect)(packageTransaction).to.have.property('reservedById');
                };
                it('should return a new packageTransaction', async () => {
                    const createStripeWebhookRes = await createStripeWebhook();
                    validResOutput(createStripeWebhookRes);
                });
            });
            context('invalid payment', () => {
                it('should throw an error', async () => {
                    routeData.rawBody.payloadString = 'bad payload';
                    await testStripeWebhookError();
                });
            });
        });
    });
});
