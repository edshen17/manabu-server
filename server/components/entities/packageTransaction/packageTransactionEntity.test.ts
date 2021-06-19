import chai from 'chai';
import equal from 'deep-equal';
import { makeFakeDbUserGenerator } from '../../dataAccess/testFixtures/fakeDbUserGenerator';
import { FakeDBUserGenerator } from '../../dataAccess/testFixtures/fakeDbUserGenerator/fakeDbUserGenerator';
import { makePackageTransactionEntity } from './index';
import { PackageTransactionEntity } from './packageTransactionEntity';

const expect = chai.expect;
let fakeDbUserGenerator: FakeDBUserGenerator;
let packageTransactionEntity: PackageTransactionEntity;

before(async () => {
  fakeDbUserGenerator = await makeFakeDbUserGenerator;
});

context('packageTransaction entity', () => {
  describe('build', async () => {
    packageTransactionEntity = await makePackageTransactionEntity;
    context('given valid inputs', () => {
      it("should return a package transaction with the teacher's data", async () => {
        const fakeTeacher = await fakeDbUserGenerator.createFakeDbTeacherWithDefaultPackages();
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
