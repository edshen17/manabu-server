import { expect } from 'chai';
import { makeGetAppointmentsUsecase } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { makeFakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { GetAppointmentsUsecase } from './getAppointmentsUsecase';

let getAppointmentsUsecase: GetAppointmentsUsecase;
let controllerDataBuilder: ControllerDataBuilder;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeAppointment: AppointmentDoc;

before(async () => {
  getAppointmentsUsecase = await makeGetAppointmentsUsecase;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
});

beforeEach(async () => {
  fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData();
  routeData = {
    params: {
      userId: fakeAppointment.hostedById,
    },
    body: {},
    query: {},
    endpointPath: '',
  };
  currentAPIUser = {
    userId: fakeAppointment.reservedById,
    role: 'user',
  };
});

describe('getAppointmentsUsecase', () => {
  describe('makeRequest', () => {
    const getAppointments = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getAppointmentsRes = await getAppointmentsUsecase.makeRequest(controllerData);
      const appointments = getAppointmentsRes.appointments;
      return appointments;
    };

    const testAppointmentView = (props: { isSelf: boolean; appointments: AppointmentDoc[] }) => {
      const { isSelf, appointments } = props;
      const firstAppointment = appointments[0];
      if (isSelf) {
        expect(firstAppointment).to.have.property('packageTransactionId');
        expect(firstAppointment).to.have.property('reservedById');
      } else {
        expect(firstAppointment).to.not.have.property('packageTransactionId');
        expect(firstAppointment).to.not.have.property('cancellationReason');
        expect(firstAppointment).to.not.have.property('reservedById');
      }
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if an invalid id is given', async () => {
          try {
            routeData.params = {};
            await getAppointments();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it("should get the user's appointments for the week", async () => {
              routeData.params = {};
              routeData.endpointPath = '/self';
              const appointments = await getAppointments();
              testAppointmentView({ isSelf: true, appointments });
            });
          });
          context('viewing other', () => {
            it("should get a restricted view of the user's appointments for the week", async () => {
              const appointments = await getAppointments();
              testAppointmentView({ isSelf: false, appointments });
            });
          });
          context('as an unlogged-in user', async () => {
            it("should get a restricted view of the user's appointments for the week", async () => {
              currentAPIUser = { role: 'user', userId: undefined };
              const appointments = await getAppointments();
              testAppointmentView({ isSelf: false, appointments });
            });
          });
        });
        context('as an admin', () => {
          context('viewing other', () => {
            it("should get the user's appointments for the week", async () => {
              currentAPIUser.userId = undefined;
              currentAPIUser.role = 'admin';
              const appointments = await getAppointments();
              testAppointmentView({ isSelf: true, appointments });
            });
          });
        });
      });
    });
  });
});
