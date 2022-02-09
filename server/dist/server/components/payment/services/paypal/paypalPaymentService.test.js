"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let paypalPaymentService;
let paymentHandlerExecuteParams;
before(async () => {
    paypalPaymentService = await _1.makePaypalPaymentService;
});
beforeEach(async () => {
    paymentHandlerExecuteParams = {
        successRedirectUrl: 'https://manabu.sg/success',
        cancelRedirectUrl: 'https://manabu.sg/cancel',
        items: [
            {
                name: 'test item',
                sku: '123',
                price: '100',
                currency: 'SGD',
                quantity: 1,
            },
        ],
        currency: 'SGD',
        total: '100',
        token: 'some unique jwt',
    };
});
describe('paypalPaymentService', () => {
    describe('executePayment', () => {
        it('should return a successful transaction response', async () => {
            const executePaymentRes = await paypalPaymentService.executePayment(paymentHandlerExecuteParams);
            (0, chai_1.expect)(executePaymentRes).to.have.property('redirectUrl');
        });
    });
    //   describe('executeSubscription', () => {})
    describe('executePayout', () => {
        it('should return a successful payout response', async () => {
            const senderBatchId = 'Test_sdk_s' + Math.random().toString(36).substring(7);
            const executePayoutRes = await paypalPaymentService.executePayout({
                type: 'email',
                emailData: {
                    subject: 'test payout subject',
                    message: 'test payout message',
                },
                id: senderBatchId,
                recipients: [
                    {
                        note: 'Your 1$ Payout!',
                        amount: {
                            currency: 'SGD',
                            value: '1.00',
                        },
                        receiver: 'payout-sdk-2@paypal.com',
                        sender_item_id: 'Test_txn_1',
                    },
                ],
            });
            (0, chai_1.expect)(executePayoutRes).to.have.property('id');
            (0, chai_1.expect)(executePayoutRes.id.length > 0).to.equal(true);
        });
    });
});
