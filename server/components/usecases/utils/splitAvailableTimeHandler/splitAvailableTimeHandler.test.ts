import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeSplitAvailableTimeHandler } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { makeFakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { SplitAvailableTimeHandler } from './splitAvailableTimeHandler';

let splitAvailableTimeHandler: SplitAvailableTimeHandler;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeAppointment: AppointmentDoc;
let fakeAvailableTime: AvailableTimeDoc;
let fakePackageTransaction: PackageTransactionDoc;
let availableTimeDbService: AvailableTimeDbService;

before(async () => {
  splitAvailableTimeHandler = await makeSplitAvailableTimeHandler;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  availableTimeDbService = await makeAvailableTimeDbService;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
    hostedById: fakePackageTransaction.hostedById,
    startDate: dayjs().toDate(),
    endDate: dayjs().add(3, 'hour').toDate(),
  });
  fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
    hostedById: fakePackageTransaction.hostedById,
    reservedById: fakePackageTransaction.reservedById,
    packageTransactionId: fakePackageTransaction._id,
    startDate: fakeAvailableTime.startDate,
    endDate: dayjs(fakeAvailableTime.startDate).add(1, 'hour').toDate(),
  });
});

describe('splitAvailableTimeHandler', () => {
  context('valid input', () => {
    const splitAvailableTime = async (): Promise<AvailableTimeDoc> => {
      await splitAvailableTimeHandler.split([fakeAppointment]);
      const updatedAvailableTime = await availableTimeDbService.findOne({
        searchQuery: {
          hostedById: fakeAppointment.hostedById,
        },
        dbServiceAccessOptions: availableTimeDbService.getBaseDbServiceAccessOptions(),
      });
      return updatedAvailableTime;
    };
    context("appointment startTime is the same as availableTime's startTime", () => {
      it('should split the availableTime so that starts at the end of the appointment', async () => {
        const updatedAvailableTime = await splitAvailableTime();
        expect(updatedAvailableTime.startDate).to.not.deep.equal(fakeAvailableTime.startDate);
        expect(updatedAvailableTime.endDate).to.deep.equal(fakeAvailableTime.endDate);
        expect(updatedAvailableTime.startDate).to.deep.equal(
          dayjs(fakeAvailableTime.startDate).add(1, 'hour').toDate()
        );
      });
    });
    context(
      "appointment startTime and endTime is not the same as availableTime's startTime and endTime",
      () => {
        it('should split the availableTime so that there is one before the appointment and one after', async () => {});
      }
    );
    context("appointment endTime is the same as availableTime's endTime", () => {
      it('should split the availableTime so that it ends at the start of the appointment', async () => {});
    });
  });
});
