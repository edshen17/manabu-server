"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
const fakePackageTransactionCheckoutTokenHandler_1 = require("../../utils/fakePackageTransactionCheckoutTokenHandler");
let controllerDataBuilder;
let createPaypalWebhookUsecase;
let routeData;
let currentAPIUser;
let fakePackageTransactionCheckoutTokenHandler;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createPaypalWebhookUsecase = await _1.makeCreatePaypalWebhookUsecase;
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
            event_type: 'PAYMENTS.PAYMENT.CREATED',
            resource: {
                transactions: [
                    {
                        custom: token,
                    },
                ],
            },
            id: 'WH-7Y7254563A4550640-11V2185806837105M',
        },
        query: {},
        endpointPath: '',
        headers: {},
    };
});
describe('createPaynowWebhookUsecase', () => {
    describe('makeRequest', () => {
        const createPaypalWebhook = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const createPaypalWebhookRes = await createPaypalWebhookUsecase.makeRequest(controllerData);
            return createPaypalWebhookRes;
        };
        const testPaypalWebhookError = async () => {
            let error;
            try {
                error = await createPaypalWebhook();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('packageTransaction', () => {
            context('successful payment', () => {
                const validResOutput = (createPaypalWebhookRes) => {
                    const packageTransaction = createPaypalWebhookRes.packageTransaction;
                    (0, chai_1.expect)(packageTransaction).to.have.property('_id');
                    (0, chai_1.expect)(packageTransaction).to.have.property('hostedById');
                    (0, chai_1.expect)(packageTransaction).to.have.property('reservedById');
                };
                it('should return a new packageTransaction', async () => {
                    const createStripeWebhookRes = await createPaypalWebhook();
                    validResOutput(createStripeWebhookRes);
                });
            });
            context('invalid payment', () => {
                it('should throw an error', async () => {
                    routeData.body.resource.transactions[0].custom = 'bad token';
                    await testPaypalWebhookError();
                });
            });
        });
    });
});
