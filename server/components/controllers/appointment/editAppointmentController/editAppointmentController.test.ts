import { expect } from 'chai';
import { makeEditAppointmentController } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { EditAppointmentUsecaseResponse } from '../../../usecases/appointment/editAppointmentUsecase/editAppointmentUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { EditAppointmentController } from './editAppointmentController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let editAppointmentController: EditAppointmentController;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAppointment: AppointmentDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  editAppointmentController = await makeEditAppointmentController;
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
  body = {
    startDate: new Date(),
    status: 'confirmed',
  };
  currentAPIUser = {
    role: 'user',
    userId: fakePackageTransaction.hostedById,
  };
});

describe('editAppointmentController', () => {
  describe('makeRequest', () => {
    const editAppointment = async (): Promise<
      ControllerResponse<EditAppointmentUsecaseResponse>
    > => {
      const editAppointmentHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const editAppointmentRes = await editAppointmentController.makeRequest(
        editAppointmentHttpRequest
      );
      return editAppointmentRes;
    };
    context('valid inputs', () => {
      it('should edit the appointment document', async () => {
        const editAppointmentRes = await editAppointment();
        expect(editAppointmentRes.statusCode).to.equal(200);
        if ('appointment' in editAppointmentRes.body) {
          expect(editAppointmentRes.body.appointment).to.not.deep.equal(fakeAppointment);
        }
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        params = {};
        const editAppointmentRes = await editAppointment();
        expect(editAppointmentRes.statusCode).to.equal(401);
      });
      it('should throw an error if user does not have access to the resource', async () => {
        params = {
          appointmentId: '507f191e810c19729de860ea',
        };
        const editAppointmentRes = await editAppointment();
        expect(editAppointmentRes.statusCode).to.equal(401);
      });
      it('should throw an error if the user is not logged in', async () => {
        currentAPIUser.userId = undefined;
        const editAppointmentRes = await editAppointment();
        expect(editAppointmentRes.statusCode).to.equal(401);
      });
    });
  });
});
