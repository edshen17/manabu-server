import { expect } from 'chai';
import { makePaypalPaymentHandler } from '.';
import { PaymentHandlerExecuteParams } from '../abstractions/IPaymentHandler';
import { PaypalPaymentHandler } from './paypalPaymentHandler';

let paypalPaymentHandler: PaypalPaymentHandler;
let paymentHandlerExecuteParams: PaymentHandlerExecuteParams;

before(async () => {
  paypalPaymentHandler = await makePaypalPaymentHandler;
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
  };
});

describe('paypalPaymentHandler', () => {
  describe('executeSinglePayment', () => {
    it('should return a successful transaction response', async () => {
      const executeSinglePaymentRes = await paypalPaymentHandler.executeSinglePayment(
        paymentHandlerExecuteParams
      );
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
