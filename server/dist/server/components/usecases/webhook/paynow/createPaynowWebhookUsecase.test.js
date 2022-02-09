"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
const fakePackageTransactionCheckoutTokenHandler_1 = require("../../utils/fakePackageTransactionCheckoutTokenHandler");
let controllerDataBuilder;
let createPaynowWebhookUsecase;
let routeData;
let currentAPIUser;
let fakePackageTransactionCheckoutTokenHandler;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createPaynowWebhookUsecase = await _1.makeCreatePaynowWebhookUsecase;
    fakePackageTransactionCheckoutTokenHandler = await fakePackageTransactionCheckoutTokenHandler_1.makeFakePackageTransactionCheckoutTokenHandler;
});
beforeEach(async () => {
    const tokenData = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
    const { token } = tokenData;
    currentAPIUser = tokenData.currentAPIUser;
    routeData = {
        rawBody: {},
        params: {},
        body: {
            key: 'charge.complete',
            data: {
                id: 'chrg_test_5pquctyn90hobjzd4fd',
                metadata: {
                    token,
                },
            },
        },
        query: {},
        endpointPath: '',
        headers: {},
    };
});
describe('createPaynowWebhookUsecase', () => {
    describe('makeRequest', () => {
        const createPaynowWebhook = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const createPaynowWebhookRes = await createPaynowWebhookUsecase.makeRequest(controllerData);
            return createPaynowWebhookRes;
        };
        const testPaynowWebhookError = async () => {
            let error;
            try {
                error = await createPaynowWebhook();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('packageTransaction', () => {
            context('successful payment', () => {
                const validResOutput = (createPaynowWebhookRes) => {
                    const packageTransaction = createPaynowWebhookRes.packageTransaction;
                    (0, chai_1.expect)(packageTransaction).to.have.property('_id');
                    (0, chai_1.expect)(packageTransaction).to.have.property('hostedById');
                    (0, chai_1.expect)(packageTransaction).to.have.property('reservedById');
                };
                it('should return a new packageTransaction', async () => {
                    const createStripeWebhookRes = await createPaynowWebhook();
                    validResOutput(createStripeWebhookRes);
                });
            });
            context('invalid payment', () => {
                it('should throw an error', async () => {
                    routeData.body.data.metadata.token = 'bad token';
                    await testPaynowWebhookError();
                });
            });
        });
    });
});
