import { expect } from 'chai';
import Omise from 'omise';
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
      type: 'paynow',
      amount: 500000,
      currency: 'sgd',
    } as Omise.Sources.ISource,
    total: 2000,
  };
});

describe('paypalPaymentHandler', () => {
  describe('executeSinglePayment', () => {
    it('should return a successful transaction response', async () => {
      const executeSinglePaymentRes = await payNowPaymentHandler.executeSinglePayment(
        paymentHandlerExecuteParams
      );
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
