import { expect } from 'chai';
import { makeCreatePaypalWebhookController } from '.';
import { StringKeyObject } from '../../../../../types/custom';
import { makeFakePackageTransactionCheckoutTokenHandler } from '../../../../usecases/utils/fakePackageTransactionCheckoutTokenHandler';
import { FakePackageTransactionCheckoutTokenHandler } from '../../../../usecases/utils/fakePackageTransactionCheckoutTokenHandler/fakePackageTransactionCheckoutTokenHandler';
import { CurrentAPIUser } from '../../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { makeIHttpRequestBuilder } from '../../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { CreatePaypalWebhookController } from './createPaypalWebhookController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let currentAPIUser: CurrentAPIUser;
let body: StringKeyObject;
let token: string;
let createPaypalWebhookController: CreatePaypalWebhookController;
let fakePackageTransactionCheckoutTokenHandler: FakePackageTransactionCheckoutTokenHandler;

before(async () => {
  createPaypalWebhookController = await makeCreatePaypalWebhookController;
  fakePackageTransactionCheckoutTokenHandler = await makeFakePackageTransactionCheckoutTokenHandler;
  iHttpRequestBuilder = makeIHttpRequestBuilder;
});

beforeEach(async () => {
  const tokenData = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
  token = tokenData.token;
  currentAPIUser = tokenData.currentAPIUser;
  body = {
    event_type: 'PAYMENTS.PAYMENT.CREATED',
    resource: {
      transactions: [
        {
          custom: token,
        },
      ],
    },
    id: 'WH-7Y7254563A4550640-11V2185806837105M',
  };
});

describe('createPaypalWebhookController', () => {
  describe('makeRequest', () => {
    const createPaypalWebhook = async () => {
      const createPaypalWebhookHttpRequest = iHttpRequestBuilder
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const createPaypalWebhookRes = await createPaypalWebhookController.makeRequest(
        createPaypalWebhookHttpRequest
      );
      return createPaypalWebhookRes;
    };
    const testValidPaypalWebhook = async () => {
      const paypalWebhookRes = await createPaypalWebhook();
      expect(paypalWebhookRes.statusCode).to.equal(201);
      expect(paypalWebhookRes.body).to.have.property('packageTransaction');
    };
    const testInvalidPaypalWebhook = async () => {
      const paypalWebhookRes = await createPaypalWebhook();
      expect(paypalWebhookRes.statusCode).to.equal(409);
    };
    context('valid inputs', () => {
      it('should create a package transaction', async () => {
        await testValidPaypalWebhook();
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if http request is invalid', async () => {
        body = {};
        await testInvalidPaypalWebhook();
      });
    });
  });
});
