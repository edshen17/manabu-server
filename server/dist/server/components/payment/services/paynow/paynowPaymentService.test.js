"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const IPaymentService_1 = require("../../abstractions/IPaymentService");
let paynowPaymentService;
let paymentHandlerExecuteParams;
before(async () => {
    paynowPaymentService = await _1.makePaynowPaymentService;
});
beforeEach(async () => {
    paymentHandlerExecuteParams = {
        successRedirectUrl: 'https://manabu.sg/success',
        cancelRedirectUrl: 'https://manabu.sg/cancel',
        items: {
            source: {
                type: IPaymentService_1.PAYMENT_GATEWAY_NAME.PAYNOW,
                amount: 5000,
                currency: 'sgd',
            },
            charge: {
                amount: 5000,
                currency: 'sgd',
                description: 'some description',
            },
        },
        total: 5000,
        token: 'some unique jwt',
    };
});
describe('paynowPaymentService', () => {
    describe('executeSinglePayment', () => {
        it('should return a successful transaction response', async () => {
            const executeSinglePaymentRes = await paynowPaymentService.executePayment(paymentHandlerExecuteParams);
            (0, chai_1.expect)(executeSinglePaymentRes).to.have.property('redirectUrl');
        });
    });
    //   describe('executeSubscription', () => {})
});
