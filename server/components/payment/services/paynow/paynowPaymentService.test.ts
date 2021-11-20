import { expect } from 'chai';
import { makePaynowPaymentService } from '.';
import {
  PaymentServiceExecutePaymentParams,
  PAYMENT_GATEWAY_NAME,
} from '../../abstractions/IPaymentService';
import { PaynowPaymentService } from './paynowPaymentService';

let paynowPaymentService: PaynowPaymentService;
let paymentHandlerExecuteParams: PaymentServiceExecutePaymentParams;

before(async () => {
  paynowPaymentService = await makePaynowPaymentService;
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

describe('paynowPaymentService', () => {
  describe('executeSinglePayment', () => {
    it('should return a successful transaction response', async () => {
      const executeSinglePaymentRes = await paynowPaymentService.executePayment(
        paymentHandlerExecuteParams
      );
      expect(executeSinglePaymentRes).to.have.property('redirectUrl');
    });
  });
  //   describe('executeSubscription', () => {})
});
