import { expect } from 'chai';
import { makeWebhookHandler } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeCreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase';
import { CreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { WebhookHandler, WebhookHandlerCreateResourceResponse } from './webhookHandler';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let webhookHandler: WebhookHandler;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;
let createPackageTransactionCheckoutRouteData: RouteData;
let createPackageTransactionCheckoutUsecase: CreatePackageTransactionCheckoutUsecase;
let token: string;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  webhookHandler = await makeWebhookHandler;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  createPackageTransactionCheckoutUsecase = await makeCreatePackageTransactionCheckoutUsecase;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
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
