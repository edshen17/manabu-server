import { expect } from 'chai';
import { makePaynowPaymentHandler } from '.';
import { PaymentHandlerExecuteParams, PAYMENT_GATEWAY_NAME } from '../abstractions/IPaymentHandler';
import { PaynowPaymentHandler } from './paynowPaymentHandler';

let paynowPaymentHandler: PaynowPaymentHandler;
let paymentHandlerExecuteParams: PaymentHandlerExecuteParams;

before(async () => {
  paynowPaymentHandler = await makePaynowPaymentHandler;
});

beforeEach(async () => {
  paymentHandlerExecuteParams = {
    successRedirectUrl: 'https://manabu.sg/success',
    cancelRedirectUrl: 'https://manabu.sg/cancel',
    items: {
      source: {
        type: PAYMENT_GATEWAY_NAME.PAYNOW,
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

describe('paynowPaymentHandler', () => {
  describe('executeSinglePayment', () => {
    it('should return a successful transaction response', async () => {
      const executeSinglePaymentRes = await paynowPaymentHandler.executeSinglePayment(
        paymentHandlerExecuteParams
      );
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
