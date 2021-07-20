import { expect } from 'chai';
import { makeFakeDbAppointmentFactory } from '.';
import { makeFakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { FakeDbAppointmentFactory } from './fakeDbAppointmentFactory';

let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;

before(async () => {
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
});

describe('fakeDbAppointmentFactory', () => {
  describe('createFakeDbData', () => {
    it('should create a fake appointment from the given users and package transaction', async () => {
      const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
      const fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
        hostedById: fakePackageTransaction.hostedById.toString(),
        reservedById: fakePackageTransaction.reservedById.toString(),
        packageTransactionId: fakePackageTransaction._id.toString(),
        startTime: new Date(),
        endTime: new Date(),
      });
      expect(fakeAppointment).to.have.property('packageTransactionData');
    });
    it('should create a fake appointment from without any input', async () => {
      const fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData();
      expect(fakeAppointment).to.have.property('packageTransactionData');
    });
  });
});
