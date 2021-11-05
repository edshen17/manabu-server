import { expect } from 'chai';
import { makeCreateStripeWebhookUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { stripe } from '../../../paymentHandlers/stripe';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeCreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase';
import { CreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import {
  CreateStripeWebhookUsecase,
  CreateStripeWebhookUsecaseResponse,
} from './createStripeWebhookUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let createStripeWebhookUsecase: CreateStripeWebhookUsecase;
let routeData: RouteData;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;
let createPackageTransactionCheckoutRouteData: RouteData;
let createPackageTransactionCheckoutUsecase: CreatePackageTransactionCheckoutUsecase;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createStripeWebhookUsecase = await makeCreateStripeWebhookUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  createPackageTransactionCheckoutUsecase = await makeCreatePackageTransactionCheckoutUsecase;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  createPackageTransactionCheckoutRouteData = {
    rawBody: {},
    headers: {},
    params: {},
    body: {
      teacherId: fakeTeacher.teacherData!._id,
      packageId: fakeTeacher.teacherData!.packages[0]._id,
      lessonDuration: 60,
      lessonLanguage: 'ja',
    },
    query: {
      paymentGateway: 'stripe',
    },
    endpointPath: '',
  };
  currentAPIUser = {
    userId: fakeUser._id,
    role: fakeUser.role,
  };
  const createPackageTransactionCheckoutControllerData = controllerDataBuilder
    .routeData(createPackageTransactionCheckoutRouteData)
    .currentAPIUser(currentAPIUser)
    .build();
  const createPackageTransactionCheckoutRes =
    await createPackageTransactionCheckoutUsecase.makeRequest(
      createPackageTransactionCheckoutControllerData
    );
  const { token } = createPackageTransactionCheckoutRes;
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
        return;
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
    });
  });
});
