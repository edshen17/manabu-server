import { expect } from 'chai';
import { makePayNowPaymentHandler } from '.';
import { PaymentHandlerExecuteParams } from '../abstractions/IPaymentHandler';
import { PayNowPaymentHandler } from './payNowPaymentHandler';

let payNowPaymentHandler: PayNowPaymentHandler;
let paymentHandlerExecuteParams: PaymentHandlerExecuteParams;

before(async () => {
  payNowPaymentHandler = await makePayNowPaymentHandler;
});

beforeEach(async () => {
  paymentHandlerExecuteParams = {
    successRedirectUrl: 'https://manabu.sg/success',
    cancelRedirectUrl: 'https://manabu.sg/cancel',
    items: {
      source: {
        type: 'paynow',
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
  };
});

describe('paypalPaymentHandler', () => {
  describe('executeSinglePayment', () => {
    it('should return a successful transaction response', async () => {
      const executeSinglePaymentRes = await payNowPaymentHandler.executeSinglePayment(
        paymentHandlerExecuteParams
      );
      console.log(executeSinglePaymentRes);
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
