import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeEndAppointmentScheduleTask } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { AppointmentDbService } from '../../../dataAccess/services/appointment/appointmentDbService';
import { makeFakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { EndAppointmentScheduleTask } from './endAppointmentScheduleTask';

let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAppointment: AppointmentDoc;
let endAppointmentScheduleTask: EndAppointmentScheduleTask;
let appointmentDbService: AppointmentDbService;
let dbServiceAccessOptions: DbServiceAccessOptions;

before(async () => {
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
  endAppointmentScheduleTask = await makeEndAppointmentScheduleTask;
  appointmentDbService = await makeAppointmentDbService;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
    hostedById: fakePackageTransaction.hostedById,
    reservedById: fakePackageTransaction.reservedById,
    packageTransactionId: fakePackageTransaction._id,
    startDate: dayjs().subtract(10, 'days').toDate(),
    endDate: dayjs().subtract(4, 'day').toDate(),
  });
  dbServiceAccessOptions = appointmentDbService.getBaseDbServiceAccessOptions();
  fakeAppointment = await appointmentDbService.findOneAndUpdate({
    dbServiceAccessOptions,
    searchQuery: {
      _id: fakeAppointment._id,
    },
    updateQuery: {
      status: 'confirmed',
    },
  });
});

describe('endAppointmentScheduleTask', () => {
  it('should change the appointment status', async () => {
    expect(fakeAppointment.status).to.equal('confirmed');
    await endAppointmentScheduleTask.execute();
    fakeAppointment = await appointmentDbService.findById({
      dbServiceAccessOptions,
      _id: fakeAppointment._id,
    });
    expect(fakeAppointment.status).to.equal('completed');
  });
});
