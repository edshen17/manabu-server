import { expect } from 'chai';
import { makeAppointmentDbService } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { AppointmentDbService } from './appointmentDbService';

let appointmentDbService: AppointmentDbService;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let dbServiceAccessOptions: DbServiceAccessOptions;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAppointment: AppointmentDoc;

before(async () => {
  appointmentDbService = await makeAppointmentDbService;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = fakeDbAppointmentFactory.getDefaultAccessOptions();
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
    hostedBy: fakePackageTransaction.hostedBy.toString(),
    reservedBy: fakePackageTransaction.reservedBy.toString(),
    packageTransactionId: fakePackageTransaction._id,
    from: new Date(),
    to: new Date(),
  });
});

describe('appointmentDbService', () => {
  describe('findById, findOne, find', () => {
    it('should find the correct appointment in the db', async () => {
      const findParams = {
        searchQuery: {
          hostedBy: fakeAppointment.hostedBy,
        },
        dbServiceAccessOptions,
      };
      const findByIdAppointment = await appointmentDbService.findById({
        _id: fakeAppointment._id,
        dbServiceAccessOptions,
      });
      const findOneAppointment = await appointmentDbService.findOne(findParams);
      const findAppointments = await appointmentDbService.find(findParams);
      expect(findByIdAppointment._id.toString()).to.equal(findOneAppointment._id.toString());
      expect(findByIdAppointment._id.toString()).to.equal(findAppointments[0]._id.toString());
    });
  });
  describe('update', () => {
    it('should update the appointment', async () => {
      const updatedAppointment = await appointmentDbService.findOneAndUpdate({
        searchQuery: {
          hostedBy: fakeAppointment.hostedBy,
        },
        updateParams: {
          status: 'cancelled',
        },
        dbServiceAccessOptions,
      });

      expect(updatedAppointment.status).to.equal('cancelled');
    });
  });
});
