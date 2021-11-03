import { expect } from 'chai';
import { makeCreateStripeWebhookController } from '.';
import { JoinedUserDoc } from '../../../../../models/User';
import { StringKeyObject } from '../../../../../types/custom';
import { makeFakeDbUserFactory } from '../../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { stripe } from '../../../../paymentHandlers/stripe';
import { makeQueryStringHandler } from '../../../../usecases/utils/queryStringHandler';
import { QueryStringHandler } from '../../../../usecases/utils/queryStringHandler/queryStringHandler';
import { CurrentAPIUser } from '../../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { makeCreatePackageTransactionCheckoutController } from '../../../checkout/packageTransaction/createPackageTransactionCheckoutController';
import { CreatePackageTransactionCheckoutController } from '../../../checkout/packageTransaction/createPackageTransactionCheckoutController/createPackageTransactionCheckoutController';
import { makeIHttpRequestBuilder } from '../../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { CreateStripeWebhookController } from './createStripeWebhookController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;
let body: StringKeyObject;
let queryToEncode: StringKeyObject;
let query: StringKeyObject;
let queryStringHandler: QueryStringHandler;
let token: string;
let createPackageTransactionCheckoutController: CreatePackageTransactionCheckoutController;
let createStripeWebhookController: CreateStripeWebhookController;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  queryStringHandler = makeQueryStringHandler;
  createPackageTransactionCheckoutController = await makeCreatePackageTransactionCheckoutController;
  createStripeWebhookController = await makeCreateStripeWebhookController;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  const body = {
    teacherId: fakeTeacher.teacherData!._id,
    packageId: fakeTeacher.teacherData!.packages[0]._id,
    lessonDuration: 60,
    lessonLanguage: 'ja',
  };
  const queryToEncode = {
    paymentGateway: 'stripe',
  };
  currentAPIUser = {
    userId: fakeUser._id,
    role: fakeUser.role,
  };
  const encodedQuery = queryStringHandler.encodeQueryStringObj(queryToEncode);
  const query = queryStringHandler.parseQueryString(encodedQuery);
  const createPackageTransactionCheckoutHttpRequest = iHttpRequestBuilder
    .body(body)
    .currentAPIUser(currentAPIUser)
    .query(query)
    .build();
  const createPackageTransactionCheckoutRes =
    await createPackageTransactionCheckoutController.makeRequest(
      createPackageTransactionCheckoutHttpRequest
    );
  if ('token' in createPackageTransactionCheckoutRes.body) {
    token = createPackageTransactionCheckoutRes.body.token;
  }
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
      const secret = process.env.STRIPE_WEBHOOK_SECREY_KEY_DEV!;
      const stripeHeader = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret,
      });
      body = {
        payloadString,
      };
      const encodedQuery = queryStringHandler.encodeQueryStringObj(queryToEncode);
      query = queryStringHandler.parseQueryString(encodedQuery);
      const createStripeWebhookHttpRequest = iHttpRequestBuilder
        .body(body)
        .currentAPIUser(currentAPIUser)
        .headers({
          'stripe-signature': stripeHeader,
        })
        .query(query)
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
    const testInvalidStripeWebhook = async () => {
      const stripeWebhookRes = await createStripeWebhook();
      expect(stripeWebhookRes.statusCode).to.equal(409);
    };
    context('valid inputs', () => {
      it('should create a package transaction', async () => {
        await testValidStripeWebhook();
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if http request is invalid', async () => {
        queryToEncode = { query: 'some unsupported query' };
        await testInvalidStripeWebhook();
      });
    });
  });
});
