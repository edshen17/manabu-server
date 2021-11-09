import { expect } from 'chai';
import { makeCreatePaynowWebhookController } from '.';
import { StringKeyObject } from '../../../../../types/custom';
import { makeFakePackageTransactionCheckoutTokenHandler } from '../../../../usecases/utils/fakePackageTransactionCheckoutTokenHandler';
import { FakePackageTransactionCheckoutTokenHandler } from '../../../../usecases/utils/fakePackageTransactionCheckoutTokenHandler/fakePackageTransactionCheckoutTokenHandler';
import { CurrentAPIUser } from '../../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { makeIHttpRequestBuilder } from '../../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { CreatePaynowWebhookController } from './createPaynowWebhookController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let currentAPIUser: CurrentAPIUser;
let body: StringKeyObject;
let token: string;
let createPaynowWebhookController: CreatePaynowWebhookController;
let fakePackageTransactionCheckoutTokenHandler: FakePackageTransactionCheckoutTokenHandler;

before(async () => {
  createPaynowWebhookController = await makeCreatePaynowWebhookController;
  fakePackageTransactionCheckoutTokenHandler = await makeFakePackageTransactionCheckoutTokenHandler;
  iHttpRequestBuilder = makeIHttpRequestBuilder;
});

beforeEach(async () => {
  const tokenData = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
  token = tokenData.token;
  currentAPIUser = tokenData.currentAPIUser;
  body = {
    key: 'charge.complete',
    data: {
      id: 'chrg_test_5pquctyn90hobjzd4fd',
      metadata: {
        token,
      },
    },
  };
});

describe('createPaynowWebhookController', () => {
  describe('makeRequest', () => {
    const createPaynowWebhook = async () => {
      const createPaynowWebhookHttpRequest = iHttpRequestBuilder
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const createPaynowWebhookRes = await createPaynowWebhookController.makeRequest(
        createPaynowWebhookHttpRequest
      );
      return createPaynowWebhookRes;
    };
    const testValidPaynowWebhook = async () => {
      const paynowWebhookRes = await createPaynowWebhook();
      expect(paynowWebhookRes.statusCode).to.equal(201);
      expect(paynowWebhookRes.body).to.have.property('packageTransaction');
    };
    const testInvalidPaynowWebhook = async () => {
      const paynowWebhookRes = await createPaynowWebhook();
      expect(paynowWebhookRes.statusCode).to.equal(409);
    };
    context('valid inputs', () => {
      it('should create a package transaction', async () => {
        await testValidPaynowWebhook();
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if http request is invalid', async () => {
        body = {};
        await testInvalidPaynowWebhook();
      });
    });
  });
});
