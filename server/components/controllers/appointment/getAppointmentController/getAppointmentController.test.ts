import { expect } from 'chai';
import { makeGetAppointmentController } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { GetAppointmentUsecaseResponse } from '../../../usecases/appointment/getAppointmentUsecase/getAppointmentUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetAppointmentController } from './getAppointmentController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let getAppointmentController: GetAppointmentController;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAppointment: AppointmentDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getAppointmentController = await makeGetAppointmentController;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
    hostedById: fakePackageTransaction.hostedById,
    reservedById: fakePackageTransaction.reservedById,
    packageTransactionId: fakePackageTransaction._id,
    startDate: fakePackageTransaction.createdDate,
    endDate: fakePackageTransaction.terminationDate,
  });
});

beforeEach(async () => {
  params = {
    appointmentId: fakeAppointment._id,
  };
  body = {};
  currentAPIUser = {
    role: 'user',
    userId: fakePackageTransaction.reservedById,
  };
});

describe('getAppointmentController', () => {
  describe('makeRequest', () => {
    const getAppointment = async (): Promise<ControllerResponse<GetAppointmentUsecaseResponse>> => {
      const getAppointmentHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const getAppointmentRes = await getAppointmentController.makeRequest(
        getAppointmentHttpRequest
      );
      return getAppointmentRes;
    };
    const testValidGetAppointment = async (): Promise<void> => {
      const getAppointmentRes = await getAppointment();
      expect(getAppointmentRes.statusCode).to.equal(200);
      if ('appointment' in getAppointmentRes.body) {
        expect(getAppointmentRes.body.appointment._id).to.deep.equal(fakeAppointment._id);
      }
    };
    const testInvalidGetAppointment = async (): Promise<void> => {
      const getAppointmentRes = await getAppointment();
      expect(getAppointmentRes.statusCode).to.equal(404);
    };
    context('valid inputs', () => {
      context('as a non-admin user', () => {
        context('viewing self', () => {
          it('should get the appointment for the user (reservedBy)', async () => {
            await testValidGetAppointment();
          });
        });
        context('viewing other', () => {
          it('should throw an error', async () => {
            currentAPIUser.userId = undefined;
            await testInvalidGetAppointment();
          });
        });
      });
      context('as an admin', () => {
        it('should get the appointment', async () => {
          currentAPIUser.role = 'admin';
          await testValidGetAppointment();
        });
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        params = {
          appointmentId: 'some id',
        };
        await testInvalidGetAppointment();
      });
    });
  });
});
