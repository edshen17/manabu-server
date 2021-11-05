import { expect } from 'chai';
import { makeCreatePaynowWebhookUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeCreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase';
import { CreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import {
  CreatePaynowWebhookUsecase,
  CreatePaynowWebhookUsecaseResponse,
} from './createPaynowWebhookUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let createPaynowWebhookUsecase: CreatePaynowWebhookUsecase;
let routeData: RouteData;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;
let createPackageTransactionCheckoutRouteData: RouteData;
let createPackageTransactionCheckoutUsecase: CreatePackageTransactionCheckoutUsecase;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createPaynowWebhookUsecase = await makeCreatePaynowWebhookUsecase;
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
      paymentGateway: 'paynow',
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
  routeData = {
    rawBody: {},
    params: {},
    body: {
      key: 'charge.complete',
      data: {
        id: 'chrg_test_5pquctyn90hobjzd4fd',
        metadata: {
          token,
        },
      },
    },
    query: {},
    endpointPath: '',
    headers: {},
  };
});

describe('createPaynowWebhookUsecase', () => {
  describe('makeRequest', () => {
    const createPaynowWebhook = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const createPaynowWebhookRes = await createPaynowWebhookUsecase.makeRequest(controllerData);
      return createPaynowWebhookRes;
    };
    const testPaynowWebhookError = async () => {
      let error;
      try {
        error = await createPaynowWebhook();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };
    context('packageTransaction', () => {
      context('successful payment', () => {
        const validResOutput = (createPaynowWebhookRes: CreatePaynowWebhookUsecaseResponse) => {
          const packageTransaction = createPaynowWebhookRes.packageTransaction;
          expect(packageTransaction).to.have.property('_id');
          expect(packageTransaction).to.have.property('hostedById');
          expect(packageTransaction).to.have.property('reservedById');
        };
        it('should return a new packageTransaction', async () => {
          const createStripeWebhookRes = await createPaynowWebhook();
          validResOutput(createStripeWebhookRes);
        });
      });
      context('invalid payment', () => {
        it('should throw an error', async () => {
          routeData.body.data.metadata.token = 'bad token';
          await testPaynowWebhookError();
        });
      });
    });
  });
});
