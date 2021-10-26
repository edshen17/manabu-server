import { expect } from 'chai';
import { makeStripeHandler } from '.';
import { PaymentHandlerExecuteParams } from '../abstractions/IPaymentHandler';
import { StripeHandler } from './stripeHandler';
let stripeHandler: StripeHandler;
let paymentHandlerExecuteParams: PaymentHandlerExecuteParams;

before(async () => {
  stripeHandler = await makeStripeHandler;
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
  };
});

describe('stripeHandler', () => {
  describe('executeSinglePayment', () => {
    it('should return a successful transaction response', async () => {
      const executeSinglePaymentRes = await stripeHandler.executeSinglePayment(
        paymentHandlerExecuteParams
      );
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
