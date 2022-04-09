import { expect } from 'chai';
import { makeGetAppointmentUsecase } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { makeFakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetAppointmentUsecase } from './getAppointmentUsecase';

let getAppointmentUsecase: GetAppointmentUsecase;
let controllerDataBuilder: ControllerDataBuilder;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAppointment: AppointmentDoc;

before(async () => {
  getAppointmentUsecase = await makeGetAppointmentUsecase;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
    hostedById: fakePackageTransaction.hostedById,
    reservedById: fakePackageTransaction.reservedById,
    packageTransactionId: fakePackageTransaction._id,
    startDate: fakePackageTransaction.createdDate,
    endDate: fakePackageTransaction.terminationDate,
  });
  routeData = {
    params: {
      appointmentId: fakeAppointment._id,
    },
    body: {},
    query: {
      startDate: fakePackageTransaction.createdDate,
      endDate: fakePackageTransaction.terminationDate,
    },
    endpointPath: '',
    headers: {},
    rawBody: {},
    cookies: {},
  };
  currentAPIUser = {
    userId: fakePackageTransaction.reservedById,
    role: 'user',
  };
});

describe('getAppointmentUsecase', () => {
  describe('makeRequest', () => {
    const getAppointment = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getAppointmentRes = await getAppointmentUsecase.makeRequest(controllerData);
      const appointment = getAppointmentRes.appointment;
      return appointment;
    };

    const testAppointmentView = (props: { isSelf: boolean; appointment: AppointmentDoc }) => {
      const { isSelf, appointment } = props;
      if (isSelf) {
        expect(appointment).to.have.property('packageTransactionId');
        expect(appointment).to.have.property('reservedById');
      } else {
        expect(appointment).to.not.have.property('packageTransactionId');
        expect(appointment).to.not.have.property('cancellationReason');
        expect(appointment).to.not.have.property('reservedById');
      }
    };

    const testAppointmentError = async () => {
      let error;
      try {
        error = await getAppointment();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if an invalid id is given', async () => {
          routeData.params = {};
          await testAppointmentError();
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should get an unrestricted view of the appointment (reservedBy)', async () => {
              const appointment = await getAppointment();
              testAppointmentView({ isSelf: true, appointment });
            });
            it('should get an unrestricted view of the appointment (hostedBy)', async () => {
              currentAPIUser.userId = fakeAppointment.hostedById;
              const appointment = await getAppointment();
              testAppointmentView({ isSelf: true, appointment });
            });
          });
          context('viewing other', () => {
            it('should throw an error', async () => {
              currentAPIUser.userId = undefined;
              await testAppointmentError();
            });
          });
        });
        context('as an admin', () => {
          context('viewing other', () => {
            it('should get an unrestricted view of the appointment', async () => {
              currentAPIUser.userId = undefined;
              currentAPIUser.role = 'admin';
              const appointment = await getAppointment();
              testAppointmentView({ isSelf: true, appointment });
            });
          });
        });
      });
    });
  });
});
