import { expect } from 'chai';
import { makeGetAppointmentsController } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { GetAppointmentsUsecaseResponse } from '../../../usecases/appointment/getAppointmentsUsecase/getAppointmentsUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { QueryStringHandler } from '../../../usecases/utils/queryStringHandler/queryStringHandler';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetAppointmentsController } from './getAppointmentsController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let getAppointmentsController: GetAppointmentsController;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAppointment: AppointmentDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;
let path: string;
let query: string;
let queryStringHandler: QueryStringHandler;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getAppointmentsController = await makeGetAppointmentsController;
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
  queryStringHandler = makeQueryStringHandler;
});

beforeEach(async () => {
  params = {
    userId: fakePackageTransaction.hostedById,
  };
  body = {};
  currentAPIUser = {
    role: 'user',
    userId: fakePackageTransaction.reservedById,
  };
  const filter = queryStringHandler.encodeQueryStringObj({
    startDate: fakePackageTransaction.createdDate,
    endDate: fakePackageTransaction.terminationDate,
  });
  query = queryStringHandler.parseQueryString(filter);
  path = '';
});

describe('getAppointmentsController', () => {
  describe('makeRequest', () => {
    const getAppointments = async (): Promise<
      ControllerResponse<GetAppointmentsUsecaseResponse>
    > => {
      const getAppointmentsHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .query(query)
        .path(path)
        .build();
      const getAppointmentsRes = await getAppointmentsController.makeRequest(
        getAppointmentsHttpRequest
      );
      return getAppointmentsRes;
    };
    const testValidGetAppointments = async (): Promise<void> => {
      const getAppointmentsRes = await getAppointments();
      expect(getAppointmentsRes.statusCode).to.equal(200);
      if ('appointments' in getAppointmentsRes.body) {
        expect(getAppointmentsRes.body.appointments.length).to.deep.equal([fakeAppointment].length);
      }
    };
    const testInvalidGetAppointments = async (): Promise<void> => {
      const getAppointmentsRes = await getAppointments();
      expect(getAppointmentsRes.statusCode).to.equal(500);
    };
    context('valid inputs', () => {
      context('as a non-admin user', () => {
        context('viewing self', () => {
          it('should get the appointments for the user', async () => {
            params = {};
            path = '/self';
            await testValidGetAppointments();
          });
        });
        context('viewing other', () => {
          it('should get the appointments', async () => {
            currentAPIUser.userId = undefined;
            const getAppointmentsRes = await getAppointments();
            await testValidGetAppointments();
          });
        });
      });
      context('as an admin', () => {
        it('should get the appointments', async () => {
          currentAPIUser.role = 'admin';
          await testValidGetAppointments();
        });
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        params = {
          appointmentId: 'some id',
        };
        await testInvalidGetAppointments();
      });
    });
  });
});
