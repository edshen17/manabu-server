import { expect } from 'chai';
import { makeEditAppointmentUsecase } from '.';
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
import { EditAppointmentUsecase } from './editAppointmentUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let editAppointmentUsecase: EditAppointmentUsecase;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAppointment: AppointmentDoc;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  editAppointmentUsecase = await makeEditAppointmentUsecase;
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
    body: {
      status: 'confirmed',
    },
    query: {},
    endpointPath: '',
  };
  currentAPIUser = {
    role: 'teacher',
    userId: fakePackageTransaction.hostedById,
  };
});

describe('editAppointmentUsecase', () => {
  describe('makeRequest', () => {
    const editAppointment = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const editAppointmentRes = await editAppointmentUsecase.makeRequest(controllerData);
      const editedAppointment = editAppointmentRes.appointment;
      return editedAppointment;
    };

    const testAppointmentView = (props: { isSelf: boolean; appointment: AppointmentDoc }) => {
      const { isSelf, appointment } = props;
      if (isSelf) {
        expect(appointment).to.have.property('packageTransactionId');
        expect(appointment).to.have.property('reservedById');
      } else {
        expect(appointment).to.not.have.property('packageTransactionId');
        expect(appointment).to.not.have.property('reservedById');
      }
    };

    const testAppointmentError = async () => {
      let error;
      try {
        error = await editAppointment();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if an invalid id is given', async () => {
          routeData.body = {
            hostedById: 'some id',
            packageTransactionData: {},
            createdDate: new Date(),
          };
          await testAppointmentError();
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('editing self', () => {
            it('should edit the appointment and return an unrestricted view of the appointment (reservedBy)', async () => {
              currentAPIUser.userId = fakeAppointment.reservedById;
              routeData.body = { status: 'student cancel' };
              await testAppointmentError();
            });
            it('should edit the appointment and return an unrestricted view of the appointment (hostedBy)', async () => {
              const appointment = await editAppointment();
              testAppointmentView({ isSelf: true, appointment });
            });
            it('should throw error if reservedBy changes status to something other than cancel', async () => {
              currentAPIUser.userId = fakeAppointment.reservedById;
              await testAppointmentError();
            });
          });
          context('editing other', () => {
            it('should throw an error', async () => {
              currentAPIUser = { role: 'user', userId: undefined };
              await testAppointmentError();
            });
          });
        });
        context('as an admin', () => {
          context('viewing other', () => {
            it('should get an unrestricted view of the appointment', async () => {
              currentAPIUser.userId = undefined;
              currentAPIUser.role = 'admin';
              const appointment = await editAppointment();
              testAppointmentView({ isSelf: true, appointment });
            });
          });
        });
      });
    });
  });
});
