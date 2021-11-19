import { expect } from 'chai';
import { makePaypalPaymentService } from '.';
import { PaymentServiceExecuteParams } from '../../abstractions/IPaymentService';
import { PaypalPaymentService } from './paypalPaymentService';

let paypalPaymentService: PaypalPaymentService;
let paymentHandlerExecuteParams: PaymentServiceExecuteParams;

before(async () => {
  paypalPaymentService = await makePaypalPaymentService;
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
  describe('executeSinglePayment', () => {
    it('should return a successful transaction response', async () => {
      const executeSinglePaymentRes = await paypalPaymentService.executeSinglePayment(
        paymentHandlerExecuteParams
      );
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
