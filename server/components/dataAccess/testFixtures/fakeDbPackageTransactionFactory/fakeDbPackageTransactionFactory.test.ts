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
      const fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithPackages();
      const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData({
        hostedById: fakeTeacher._id,
        reservedById: fakeUser._id,
        packageId: fakeTeacher.teacherData!.packages[0]._id,
        lessonDuration: 60,
        priceData: { currency: 'SGD', subTotal: 0, total: 0 },
        remainingAppointments: 0,
        lessonLanguage: 'ja',
        isSubscription: false,
        paymentData: {},
      });
      expect(fakePackageTransaction._id.toString().length).to.equal(24);
    });
  });
});
