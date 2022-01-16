import { expect } from 'chai';
import { makeCreateStripeWebhookUsecase } from '.';
import { STRIPE_WEBHOOK_SECREY_KEY_DEV } from '../../../../constants';
import { stripe } from '../../../payment/services/stripe';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { makeFakePackageTransactionCheckoutTokenHandler } from '../../utils/fakePackageTransactionCheckoutTokenHandler';
import { FakePackageTransactionCheckoutTokenHandler } from '../../utils/fakePackageTransactionCheckoutTokenHandler/fakePackageTransactionCheckoutTokenHandler';
import {
  CreateStripeWebhookUsecase,
  CreateStripeWebhookUsecaseResponse,
} from './createStripeWebhookUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let createStripeWebhookUsecase: CreateStripeWebhookUsecase;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakePackageTransactionCheckoutTokenHandler: FakePackageTransactionCheckoutTokenHandler;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createStripeWebhookUsecase = await makeCreateStripeWebhookUsecase;
  fakePackageTransactionCheckoutTokenHandler = await makeFakePackageTransactionCheckoutTokenHandler;
});

beforeEach(async () => {
  const tokenData = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
  const { token } = tokenData;
  currentAPIUser = tokenData.currentAPIUser;
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
  routeData = {
    rawBody: {
      payloadString,
    },
    params: {},
    body: {},
    query: {},
    endpointPath: '',
    headers: {
      'stripe-signature': stripeHeader,
    },
  };
});

describe('createStripeWebhookUsecase', () => {
  describe('makeRequest', () => {
    const createStripeWebhook = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const createStripeWebhookRes = await createStripeWebhookUsecase.makeRequest(controllerData);
      return createStripeWebhookRes;
    };
    const testStripeWebhookError = async () => {
      let error;
      try {
        error = await createStripeWebhook();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };
    context('packageTransaction', () => {
      context('successful payment', () => {
        const validResOutput = (createStripeWebhookRes: CreateStripeWebhookUsecaseResponse) => {
          const packageTransaction = createStripeWebhookRes.packageTransaction;
          expect(packageTransaction).to.have.property('_id');
          expect(packageTransaction).to.have.property('hostedById');
          expect(packageTransaction).to.have.property('reservedById');
        };
        it('should return a new packageTransaction', async () => {
          const createStripeWebhookRes = await createStripeWebhook();
          validResOutput(createStripeWebhookRes);
        });
      });
      context('invalid payment', () => {
        it('should throw an error', async () => {
          routeData.rawBody.payloadString = 'bad payload';
          await testStripeWebhookError();
        });
      });
    });
  });
});
