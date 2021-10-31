import { expect } from 'chai';
import { makeCreatePackageTransactionCheckoutUsecase } from '.';
import { JoinedUserDoc } from '../../../../../models/User';
import { makeFakeDbUserFactory } from '../../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../../utils/controllerDataBuilder/controllerDataBuilder';
import { CreatePackageTransactionCheckoutUsecase } from './createPackageTransactionCheckoutUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let routeData: RouteData;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;
let createPackageTransactionCheckoutUsecase: CreatePackageTransactionCheckoutUsecase;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createPackageTransactionCheckoutUsecase = await makeCreatePackageTransactionCheckoutUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  currentAPIUser = {
    userId: fakeUser._id,
    role: fakeUser.role,
  };
  routeData = {
    headers: {},
    params: {},
    body: {
      teacherId: fakeTeacher.teacherData!._id,
      packageId: fakeTeacher.teacherData!.packages[0]._id,
      lessonDuration: 60,
      lessonLanguage: 'ja',
      lessonAmount: 5,
    },
    query: {
      paymentGateway: 'paypal',
    },
    endpointPath: '',
  };
});

describe('createPackageTransactionCheckoutUsecase', () => {
  describe('makeRequest', () => {
    const createPackageTransactionCheckout = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const createPackageTransactionCheckoutRes =
        await createPackageTransactionCheckoutUsecase.makeRequest(controllerData);
      return createPackageTransactionCheckoutRes;
    };
    const testPackageTransactionCheckoutError = async () => {
      let error;
      try {
        error = await createPackageTransactionCheckout();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if invalid data is passed', async () => {
          const routeDataBody = routeData.body;
          routeDataBody.hostedById = 'some id';
          routeDataBody.createdDate = new Date();
          await testPackageTransactionCheckoutError();
        });
        it('should throw an error if body contains an invalid userId', async () => {
          routeData.body.teacherId = 'bad id';
          await testPackageTransactionCheckoutError();
        });
        it('should throw an error if user not logged in', async () => {
          currentAPIUser.userId = undefined;
          await testPackageTransactionCheckoutError();
        });
      });
      context('valid inputs', () => {
        const validResOutput = async () => {
          const createPackageTransactionCheckoutRes = await createPackageTransactionCheckout();
          expect(createPackageTransactionCheckoutRes).to.have.property('redirectUrl');
        };
        context('one-time payment', () => {
          context('paypal', () => {
            it('should get a valid checkout link', async () => {
              await validResOutput();
            });
          });
          context('stripe', () => {
            it('should get a valid checkout link', async () => {
              routeData.query.paymentGateway = 'stripe';
              await validResOutput();
            });
          });
          context('paynow', () => {
            it('should get a valid checkout link', async () => {
              routeData.query.paymentGateway = 'paynow';
              await validResOutput();
            });
          });
        });
      });
    });
  });
});
