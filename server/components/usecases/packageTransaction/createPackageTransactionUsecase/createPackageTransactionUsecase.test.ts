import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeCreatePackageTransactionUsecase } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { JoinedUserDoc } from '../../../../models/User';
import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { TEACHER_ENTITY_TYPE } from '../../../entities/teacher/teacherEntity';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeCreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase';
import { CreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import {
  CreatePackageTransactionUsecase,
  CreatePackageTransactionUsecaseResponse,
} from './createPackageTransactionUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let fakeTeacher: JoinedUserDoc;
let fakeAvailableTime: AvailableTimeDoc;
let createPackageTransactionUsecase: CreatePackageTransactionUsecase;
let createPackageTransactionCheckoutUsecase: CreatePackageTransactionCheckoutUsecase;
let createPackageTransactionUsecaseRouteData: RouteData;
let createPackageTransactionCheckoutRouteData: RouteData;
let fakeUser: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;
let teacherDbService: TeacherDbService;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createPackageTransactionUsecase = await makeCreatePackageTransactionUsecase;
  createPackageTransactionCheckoutUsecase = await makeCreatePackageTransactionCheckoutUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  teacherDbService = await makeTeacherDbService;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
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
      packageId: fakeTeacher.teacherData!.packages[3]._id,
      lessonDuration: 60,
      lessonLanguage: 'ja',
      timeslots: [{ startDate, endDate }],
    },
    query: {
      paymentGateway: 'paypal',
    },
    endpointPath: '',
    cookies: {},
  };
  createPackageTransactionUsecaseRouteData = {
    rawBody: {},
    params: {},
    body: {},
    query: {},
    endpointPath: '',
    headers: {},
    cookies: {},
  };
});

const createPackageTransaction = async () => {
  const createPackageTransactionCheckoutControllerData = controllerDataBuilder
    .routeData(createPackageTransactionCheckoutRouteData)
    .currentAPIUser(currentAPIUser)
    .build();
  const createPackageTransactionCheckoutRes =
    await createPackageTransactionCheckoutUsecase.makeRequest(
      createPackageTransactionCheckoutControllerData
    );
  const { token } = createPackageTransactionCheckoutRes;
  createPackageTransactionUsecaseRouteData.query = {
    token,
    paymentId: 'some payment id',
  };
  const createPackageTransactionControllerData = controllerDataBuilder
    .routeData(createPackageTransactionUsecaseRouteData)
    .currentAPIUser(currentAPIUser)
    .build();
  const createPackageTransactionRes = await createPackageTransactionUsecase.makeRequest(
    createPackageTransactionControllerData
  );
  return createPackageTransactionRes;
};

describe('createPackageTransactionUsecase', () => {
  describe('makeRequest', () => {
    const testPackageTransactionError = async () => {
      let error;
      try {
        await createPackageTransaction();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if token has been used more than once', async () => {
          await createPackageTransaction();
          let error;
          try {
            // cannot reuse testPackageTransactionError here because it overwrites the blacklisted jwt during checkout
            const createPackageTransactionControllerData = controllerDataBuilder
              .routeData(createPackageTransactionUsecaseRouteData)
              .currentAPIUser(currentAPIUser)
              .build();
            const createPackageTransactionRes = await createPackageTransactionUsecase.makeRequest(
              createPackageTransactionControllerData
            );
          } catch (err) {
            error = err;
          }
          expect(error).to.be.an('error');
        });
        it('should throw an error if body is invalid', async () => {
          createPackageTransactionCheckoutRouteData.body = {};
          await testPackageTransactionError();
        });
      });
      context('valid inputs', () => {
        const validResOutput = (
          createPackageTransactionRes: CreatePackageTransactionUsecaseResponse
        ) => {
          const { packageTransaction, balanceTransactions, incomeReport, user } =
            createPackageTransactionRes;
          const studentDebitBalanceTransaction = balanceTransactions[0];
          const studentCreditBalanceTransaction = balanceTransactions[1];
          const teacherBalanceTransaction = balanceTransactions[2];
          expect(user.memberships.length > 0).to.equal(true);
          expect(packageTransaction).to.have.property('hostedById');
          expect(packageTransaction).to.have.property('reservedById');
          expect(packageTransaction).to.have.property('packageId');
          expect(balanceTransactions.length == 3).to.equal(true);
          expect(
            studentDebitBalanceTransaction.balanceChange +
              studentDebitBalanceTransaction.processingFee
          ).to.equal(studentDebitBalanceTransaction.totalPayment);
          expect(
            studentCreditBalanceTransaction.balanceChange < 0 &&
              studentCreditBalanceTransaction.totalPayment == 0
          ).to.equal(true);
          expect(teacherBalanceTransaction.processingFee < 0).to.equal(true);
          expect(incomeReport.revenue > 0).to.equal(true);
        };
        it('should create a packageTransaction and 3 balanceTransactions', async () => {
          const createPackageTransactionRes = await createPackageTransaction();
          validResOutput(createPackageTransactionRes);
        });
        it('should return correct balance transaction rates if pro teacher', async () => {
          const dbServiceAccessOptions = teacherDbService.getBaseDbServiceAccessOptions();
          await teacherDbService.findOneAndUpdate({
            searchQuery: {
              _id: fakeTeacher.teacherData!._id,
            },
            updateQuery: {
              type: TEACHER_ENTITY_TYPE.LICENSED,
            },
            dbServiceAccessOptions,
          });
          const createPackageTransactionRes = await createPackageTransaction();
          validResOutput(createPackageTransactionRes);
        });
      });
    });
  });
});

export { createPackageTransaction };
