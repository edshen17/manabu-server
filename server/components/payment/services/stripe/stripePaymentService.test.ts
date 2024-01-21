import { expect } from 'chai';
import { makeStripePaymentService } from '.';
import {
  PAYMENT_TYPE,
  PaymentServiceExecutePaymentParams,
} from '../../abstractions/IPaymentService';
import { StripePaymentService } from './stripePaymentService';
let stripePaymentService: StripePaymentService;
let paymentHandlerExecuteParams: PaymentServiceExecutePaymentParams;

before(async () => {
  stripePaymentService = await makeStripePaymentService;
});

beforeEach(async () => {
  paymentHandlerExecuteParams = {
    successRedirectUrl: 'https://manabu.sg/success',
    cancelRedirectUrl: 'https://manabu.sg/cancel',
    type: PAYMENT_TYPE.PAYMENT,
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
      const executeSinglePaymentRes = await stripePaymentService.executePayment(
        paymentHandlerExecuteParams
      );
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
