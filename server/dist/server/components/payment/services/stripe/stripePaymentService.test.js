"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let stripePaymentService;
let paymentHandlerExecuteParams;
before(async () => {
    stripePaymentService = await _1.makeStripePaymentService;
});
beforeEach(async () => {
    paymentHandlerExecuteParams = {
        successRedirectUrl: 'https://manabu.sg/success',
        cancelRedirectUrl: 'https://manabu.sg/cancel',
        items: [
            {
                price_data: {
                    currency: 'sgd',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        total: 2000,
        token: 'some unique jwt',
    };
});
describe('stripePaymentService', () => {
    describe('executeSinglePayment', () => {
        it('should return a successful transaction response', async () => {
            const executeSinglePaymentRes = await stripePaymentService.executePayment(paymentHandlerExecuteParams);
            (0, chai_1.expect)(executeSinglePaymentRes).to.have.property('redirectUrl');
        });
    });
    //   describe('executeSubscription', () => {})
});
