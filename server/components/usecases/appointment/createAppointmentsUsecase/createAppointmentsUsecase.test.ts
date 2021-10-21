import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeCreateAppointmentsUsecase } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import {
  CreateAppointmentsUsecase,
  CreateAppointmentsUsecaseResponse,
} from './createAppointmentsUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let createAppointmentsUsecase: CreateAppointmentsUsecase;
let routeData: RouteData;
let firstFakePackageTransaction: PackageTransactionDoc;
let secondFakePackageTransaction: PackageTransactionDoc;
let fakeAvailableTime: AvailableTimeDoc;
let currentAPIUser: CurrentAPIUser;
let availableTimeDbService: AvailableTimeDbService;
let packageTransactionDbService: PackageTransactionDbService;
let firstAppointment: any;
let secondAppointment: any;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createAppointmentsUsecase = await makeCreateAppointmentsUsecase;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  availableTimeDbService = await makeAvailableTimeDbService;
  packageTransactionDbService = await makePackageTransactionDbService;
});

beforeEach(async () => {
  firstFakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  secondFakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
    hostedById: firstFakePackageTransaction.hostedById,
    startDate: dayjs().toDate(),
    endDate: dayjs().add(3, 'hour').toDate(),
  });
  currentAPIUser = {
    userId: firstFakePackageTransaction.reservedById,
    role: 'user',
  };
  routeData = {
    params: {},
    body: {
      appointments: [
        {
          hostedById: firstFakePackageTransaction.hostedById,
          packageTransactionId: firstFakePackageTransaction._id,
          startDate: fakeAvailableTime.startDate,
          endDate: dayjs(fakeAvailableTime.startDate).add(1, 'hour').toDate(),
        },
        {
          hostedById: firstFakePackageTransaction.hostedById,
          packageTransactionId: firstFakePackageTransaction._id,
          startDate: dayjs(fakeAvailableTime.startDate).add(1, 'hour').toDate(),
          endDate: dayjs(fakeAvailableTime.startDate).add(2, 'hour').toDate(),
        },
      ],
    },
    query: {},
    endpointPath: '',
  };
  firstAppointment = routeData.body.appointments[0];
  secondAppointment = routeData.body.appointments[1];
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
    const testAppointmentsError = async () => {
      let error;
      try {
        error = await createAppointments();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if body is invalid', async () => {
          firstAppointment.hostedById = 'some id';
          firstAppointment.createdDate = new Date();
          await testAppointmentsError();
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
          firstAppointment.hostedById = '507f1f77bcf86cd799439011';
          await testAppointmentsError();
        });
        it('should throw an error if body contains an foreign keys that do not exist', async () => {
          firstAppointment.hostedById = '507f1f77bcf86cd799439011';
          firstAppointment.reservedById = '507f1f77bcf86cd799439011';
          firstAppointment.packageTransactionId = '507f1f77bcf86cd799439011';
          await testAppointmentsError();
        });
        it('should throw an error if the lesson duration is wrong', async () => {
          firstAppointment.endDate = dayjs(firstAppointment.endDate).add(1, 'hour').toDate();
          await testAppointmentsError();
        });
        it('should throw an error if no corresponding available time exists', async () => {
          firstAppointment.startDate = dayjs().add(5, 'hour').toDate();
          firstAppointment.endDate = dayjs().add(6, 'hour').toDate();
          await testAppointmentsError();
        });
        it('should throw an error if appointment goes over available time', async () => {
          firstAppointment.endDate = dayjs(firstAppointment.endDate).add(1, 'hour').toDate();
          await testAppointmentsError();
        });
        it('should throw an error if user is not logged in', async () => {
          currentAPIUser.userId = undefined;
          await testAppointmentsError();
        });
        it('should throw an error if one of the appointments is not of the same type', async () => {
          secondAppointment.packageTransactionId = secondFakePackageTransaction._id;
          await testAppointmentsError();
        });
      });
      context('valid inputs', () => {
        const validResOutput = async (
          createAppointmentRes: CreateAppointmentsUsecaseResponse
        ): Promise<void> => {
          const appointments = createAppointmentRes.appointments;
          const firstAppointment = createAppointmentRes.appointments[0];
          const dbServiceAccessOptions =
            packageTransactionDbService.getBaseDbServiceAccessOptions();
          const updatedPackageTransaction = await packageTransactionDbService.findById({
            _id: firstAppointment.packageTransactionId,
            dbServiceAccessOptions,
          });
          expect(appointments.length).to.equal(2);
          expect(firstAppointment).to.have.property('hostedById');
          expect(firstAppointment).to.have.property('startDate');
          expect(firstAppointment).to.have.property('endDate');
          expect(firstAppointment).to.have.property('packageTransactionData');
          expect(
            updatedPackageTransaction.remainingAppointments <
              firstFakePackageTransaction.remainingAppointments
          ).to.equal(true);
        };
        it('should return a new appointment', async () => {
          const createAppointmentRes = await createAppointments();
          await validResOutput(createAppointmentRes);
        });
      });
    });
  });
});
