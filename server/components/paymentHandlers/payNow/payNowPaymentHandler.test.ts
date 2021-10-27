import { expect } from 'chai';
import { makePaynowPaymentHandler } from '.';
import { PaymentHandlerExecuteParams } from '../abstractions/IPaymentHandler';
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
      const executeSinglePaymentRes = await paynowPaymentHandler.executeSinglePayment(
        paymentHandlerExecuteParams
      );
      console.log(executeSinglePaymentRes);
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
