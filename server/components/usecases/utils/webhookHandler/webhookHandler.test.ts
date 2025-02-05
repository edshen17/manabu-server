import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeWebhookHandler } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { PAYMENT_TYPE } from '../../../payment/abstractions/IPaymentService';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeCreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase';
import { CreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { WebhookHandler, WebhookHandlerCreateResourceResponse } from './webhookHandler';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let webhookHandler: WebhookHandler;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let fakeAvailableTime: AvailableTimeDoc;
let currentAPIUser: CurrentAPIUser;
let createPackageTransactionCheckoutRouteData: RouteData;
let createPackageTransactionCheckoutUsecase: CreatePackageTransactionCheckoutUsecase;
let token: string;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  webhookHandler = await makeWebhookHandler;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  createPackageTransactionCheckoutUsecase = await makeCreatePackageTransactionCheckoutUsecase;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  const startDate = dayjs().toDate();
  const endDate = dayjs().add(1, 'hour').toDate();
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
    hostedById: fakeTeacher._id,
    startDate,
    endDate,
  });
  currentAPIUser = {
    userId: fakeUser._id,
    role: fakeUser.role,
  };
  createPackageTransactionCheckoutRouteData = {
    rawBody: {},
    headers: {},
    params: {},
    body: {
      teacherId: fakeTeacher.teacherData!._id,
      packageId: fakeTeacher.teacherData!.packages[0]._id,
      lessonDuration: 60,
      lessonLanguage: 'ja',
      timeslots: [{ startDate, endDate }],
      type: PAYMENT_TYPE.PAYMENT,
    },
    query: {
      paymentGateway: 'stripe',
    },
    endpointPath: '',
    cookies: {},
    req: {},
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
  token = createPackageTransactionCheckoutRes.token;
});

describe('webhookHandler', () => {
  describe('createResource', () => {
    const createResource = async () => {
      const createResourceRes = await webhookHandler.createResource({
        token,
        currentAPIUser,
        paymentId: 'some payment id',
      });
      return createResourceRes;
    };
    const testCreateResourceError = async () => {
      let error;
      try {
        error = await createResource();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };
    context('packageTransaction', () => {
      context('valid inputs', () => {
        const validResOutput = (createResourceRes: WebhookHandlerCreateResourceResponse) => {
          const packageTransaction = createResourceRes.packageTransaction;
          expect(packageTransaction).to.have.property('_id');
          expect(packageTransaction).to.have.property('hostedById');
          expect(packageTransaction).to.have.property('reservedById');
        };
        it('should return a new packageTransaction', async () => {
          const createResourceRes = await createResource();
          validResOutput(createResourceRes);
        });
      });
      context('invalid inputs', () => {
        it('should throw an error', async () => {
          token = 'bad token';
          await testCreateResourceError();
        });
      });
    });
  });
});
