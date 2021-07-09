import { expect } from 'chai';
import { makeFakeDbPackageTransactionFactory } from '.';
import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';
import { FakeDbPackageTransactionFactory } from './fakeDbPackageTransactionFactory';

let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbUserFactory: FakeDbUserFactory;

before(async () => {
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

describe('fakeDbPackageTransaction', () => {
  describe('createFakeDbData', () => {
    it('should create a fake package transaction using data from a fake teacher', async () => {
      const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
      expect(fakePackageTransaction._id.toString().length).to.equal(24);
    });
    it('should create a fake package transaction using data from the given fake users', async () => {
      const fakeUser = await fakeDbUserFactory.createFakeDbUser();
      const fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
      const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData({
        hostedById: fakeTeacher._id.toString(),
        reservedById: fakeUser._id.toString(),
        packageId: fakeTeacher.teacherData.packages[0]._id.toString(),
        reservationLength: 60,
        transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
        remainingAppointments: 0,
        lessonLanguage: 'ja',
        isSubscription: false,
        paymentMethodData: {},
      });
      expect(fakePackageTransaction._id.toString().length).to.equal(24);
    });
  });
});
