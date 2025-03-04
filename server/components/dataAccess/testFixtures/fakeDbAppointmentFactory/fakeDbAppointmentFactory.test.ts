import { expect } from 'chai';
import dayjs from 'dayjs';
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
        hostedById: fakePackageTransaction.hostedById,
        reservedById: fakePackageTransaction.reservedById,
        packageTransactionId: fakePackageTransaction._id,
        startDate: dayjs().toDate(),
        endDate: dayjs().add(30, 'minute').toDate(),
      });
      expect(fakeAppointment).to.have.property('hostedById');
    });
    it('should create a fake appointment from without any input', async () => {
      const fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData();
      expect(fakeAppointment).to.have.property('hostedById');
    });
  });
});
