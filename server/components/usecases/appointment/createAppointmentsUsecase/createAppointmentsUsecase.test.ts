import { expect } from 'chai';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { makeCreateAppointmentsUsecase } from '.';
import {
  CreateAppointmentsUsecase,
  CreateAppointmentsUsecaseResponse,
} from './createAppointmentsUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import dayjs from 'dayjs';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let createAppointmentsUsecase: CreateAppointmentsUsecase;
let routeData: RouteData;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAvailableTime: AvailableTimeDoc;
let currentAPIUser: CurrentAPIUser;
let availableTimeDbService: AvailableTimeDbService;
let routeDataAppointment: any;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createAppointmentsUsecase = await makeCreateAppointmentsUsecase;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  availableTimeDbService = await makeAvailableTimeDbService;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
    hostedById: fakePackageTransaction.hostedById,
    startDate: dayjs().toDate(),
    endDate: dayjs().add(3, 'hour').toDate(),
  });
  currentAPIUser = {
    userId: fakePackageTransaction.reservedById,
    role: 'user',
  };
  routeData = {
    params: {},
    body: {
      appointments: [
        {
          hostedById: fakePackageTransaction.hostedById,
          reservedById: fakePackageTransaction.reservedById,
          packageTransactionId: fakePackageTransaction._id,
          startDate: fakeAvailableTime.startDate,
          endDate: dayjs(fakeAvailableTime.startDate).add(1, 'hour').toDate(),
        },
      ],
    },
    query: {},
    endpointPath: '',
  };
  routeDataAppointment = routeData.body.appointments[0];
});

describe('createAppointmentUsecase', () => {
  describe('makeRequest', () => {
    const createAppointments = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const createAppointmentRes = await createAppointmentsUsecase.makeRequest(controllerData);
      return createAppointmentRes;
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if body is invalid', async () => {
          routeDataAppointment.hostedById = 'some id';
          routeDataAppointment.createdDate = new Date();
          try {
            await createAppointments();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw an error if there is an appointment overlap', async () => {
          try {
            await createAppointments();
            await createAppointments();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw an error if body contains an hostedById other than the currentAPIUser id', async () => {
          try {
            routeDataAppointment.hostedById = '507f1f77bcf86cd799439011';
            await createAppointments();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw an error if body contains an foreign keys that do not exist', async () => {
          try {
            routeDataAppointment.hostedById = '507f1f77bcf86cd799439011';
            routeDataAppointment.reservedById = '507f1f77bcf86cd799439011';
            routeDataAppointment.packageTransactionId = '507f1f77bcf86cd799439011';
            await createAppointments();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw an error if the lesson duration is wrong', async () => {
          try {
            routeDataAppointment.endDate = dayjs(routeDataAppointment.endDate)
              .add(1, 'hour')
              .toDate();
            await createAppointments();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw an error if no corresponding available time exists', async () => {
          try {
            routeDataAppointment.startDate = dayjs().add(5, 'hour').toDate();
            routeDataAppointment.endDate = dayjs().add(6, 'hour').toDate();
            await createAppointments();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw an error if appointment goes over available time', async () => {
          try {
            routeDataAppointment.startDate = dayjs(routeDataAppointment.startDate)
              .add(3, 'hour')
              .toDate();
            routeDataAppointment.endDate = dayjs(routeDataAppointment.startDate)
              .add(1, 'hour')
              .toDate();
            await createAppointments();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw an error if user is not logged in', async () => {
          try {
            currentAPIUser.userId = undefined;
            await createAppointments();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        const validResOutput = (createAppointmentRes: CreateAppointmentsUsecaseResponse) => {
          const appointments = createAppointmentRes.appointments;
          const appointment = createAppointmentRes.appointments[0];
          expect(appointments.length).to.equal(1);
          expect(appointment).to.have.property('hostedById');
          expect(appointment).to.have.property('startDate');
          expect(appointment).to.have.property('endDate');
          expect(appointment).to.have.property('packageTransactionData');
        };
        it('should return a new appointment', async () => {
          const createAppointmentRes = await createAppointments();
          validResOutput(createAppointmentRes);
        });
      });
    });
  });
});
