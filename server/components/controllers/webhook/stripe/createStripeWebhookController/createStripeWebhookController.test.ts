import { expect } from 'chai';
import { makeCreateStripeWebhookController } from '.';
import { STRIPE_WEBHOOK_SECREY_KEY_DEV } from '../../../../../constants';
import { StringKeyObject } from '../../../../../types/custom';
import { stripe } from '../../../../paymentHandlers/stripe';
import { makeFakePackageTransactionCheckoutTokenHandler } from '../../../../usecases/utils/fakePackageTransactionCheckoutTokenHandler';
import { FakePackageTransactionCheckoutTokenHandler } from '../../../../usecases/utils/fakePackageTransactionCheckoutTokenHandler/fakePackageTransactionCheckoutTokenHandler';
import { CurrentAPIUser } from '../../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { makeIHttpRequestBuilder } from '../../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { CreateStripeWebhookController } from './createStripeWebhookController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let currentAPIUser: CurrentAPIUser;
let rawBody: StringKeyObject;
let token: string;
let createStripeWebhookController: CreateStripeWebhookController;
let fakePackageTransactionCheckoutTokenHandler: FakePackageTransactionCheckoutTokenHandler;

before(async () => {
  createStripeWebhookController = await makeCreateStripeWebhookController;
  fakePackageTransactionCheckoutTokenHandler = await makeFakePackageTransactionCheckoutTokenHandler;
  iHttpRequestBuilder = makeIHttpRequestBuilder;
});

beforeEach(async () => {
  const tokenData = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
  token = tokenData.token;
  currentAPIUser = tokenData.currentAPIUser;
});

describe('createStripeWebhookController', () => {
  describe('makeRequest', () => {
    const createStripeWebhook = async () => {
      const payload = {
        id: 'evt_test_webhook',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_3JrSNXEQ9HTqnQXA0eEZG7gb',
            charges: {
              data: [
                {
                  metadata: {
                    token,
                  },
                },
              ],
            },
          },
        },
      };
      const payloadString = JSON.stringify(payload, null, 2);
      const secret = STRIPE_WEBHOOK_SECREY_KEY_DEV;
      const stripeHeader = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret,
      });
      rawBody = {
        payloadString,
      };
      const createStripeWebhookHttpRequest = iHttpRequestBuilder
        .rawBody(rawBody)
        .currentAPIUser(currentAPIUser)
        .headers({
          'stripe-signature': stripeHeader,
        })
        .build();
      const createStripeWebhookRes = await createStripeWebhookController.makeRequest(
        createStripeWebhookHttpRequest
      );
      return createStripeWebhookRes;
    };
    const testValidStripeWebhook = async () => {
      const stripeWebhookRes = await createStripeWebhook();
      expect(stripeWebhookRes.statusCode).to.equal(201);
      expect(stripeWebhookRes.body).to.have.property('packageTransaction');
    };
    context('valid inputs', () => {
      it('should create a package transaction', async () => {
        await testValidStripeWebhook();
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if http request is invalid', async () => {
        const createStripeWebhookHttpRequest = iHttpRequestBuilder
          .rawBody(rawBody)
          .currentAPIUser(currentAPIUser)
          .build();
        const createStripeWebhookRes = await createStripeWebhookController.makeRequest(
          createStripeWebhookHttpRequest
        );
        expect(createStripeWebhookRes.statusCode).to.equal(409);
      });
    });
  });
});
