import { expect } from 'chai';
import { makePaypalHandler } from '.';
import { PaymentHandlerExecuteParams } from '../abstractions/IPaymentHandler';
import { PaypalHandler } from './paypalHandler';

let paypalHandler: PaypalHandler;
let paymentHandlerExecuteParams: PaymentHandlerExecuteParams;

before(async () => {
  paypalHandler = await makePaypalHandler;
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

describe('paypalHandler', () => {
  describe('executeSinglePayment', () => {
    it('should return a successful transaction response', async () => {
      const executeSinglePaymentRes = await paypalHandler.executeSinglePayment(
        paymentHandlerExecuteParams
      );
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
