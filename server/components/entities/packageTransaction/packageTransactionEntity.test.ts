import chai from 'chai';
import equal from 'deep-equal';
import { makeFakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makePackageTransactionEntity } from './index';
import { PackageTransactionEntity } from './packageTransactionEntity';

const expect = chai.expect;
let fakeDbUserFactory: FakeDbUserFactory;
let packageTransactionEntity: PackageTransactionEntity;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  packageTransactionEntity = await makePackageTransactionEntity;
});

context('packageTransaction entity', () => {
  describe('build', async () => {
    describe('given valid inputs', () => {
      it("should return a package transaction with the teacher's data", async () => {
        const fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
        const testPackageTransaction = await packageTransactionEntity.build({
          hostedBy: fakeTeacher._id,
          reservedBy: fakeTeacher._id,
          packageId: fakeTeacher.teacherData.packages[0]._id,
          reservationLength: 60,
          remainingAppointments: 5,
          transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
        });

        expect(testPackageTransaction.lessonLanguage).to.equal('ja');
        expect(testPackageTransaction.isSubscription).to.equal(false);
        expect(
          equal(testPackageTransaction.packageData, fakeTeacher.teacherData.packages[0])
        ).to.equal(true);
        expect(equal(testPackageTransaction.hostedByData, fakeTeacher)).to.equal(true);
        expect(equal(testPackageTransaction.reservedByData, fakeTeacher)).to.equal(true);
      });
    });
  });
});
