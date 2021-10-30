import { expect } from 'chai';
import { makeStripePaymentHandler } from '.';
import { PaymentHandlerExecuteParams } from '../abstractions/IPaymentHandler';
import { StripePaymentHandler } from './stripePaymentHandler';
let stripePaymentHandler: StripePaymentHandler;
let paymentHandlerExecuteParams: PaymentHandlerExecuteParams;

before(async () => {
  stripePaymentHandler = await makeStripePaymentHandler;
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

describe('stripePaymentHandler', () => {
  describe('executeSinglePayment', () => {
    it('should return a successful transaction response', async () => {
      const executeSinglePaymentRes = await stripePaymentHandler.executeSinglePayment(
        paymentHandlerExecuteParams
      );
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
