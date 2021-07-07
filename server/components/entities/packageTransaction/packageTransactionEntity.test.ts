import { expect } from 'chai';
import { makeFakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makePackageTransactionEntity } from './index';
import { PackageTransactionEntity } from './packageTransactionEntity';

let fakeDbUserFactory: FakeDbUserFactory;
let packageTransactionEntity: PackageTransactionEntity;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  packageTransactionEntity = await makePackageTransactionEntity;
});

context('packageTransaction entity', () => {
  describe('build', async () => {
    context('given valid inputs', () => {
      it("should return a package transaction with the teacher's data", async () => {
        const fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
        const fakePackageTransaction = await packageTransactionEntity.build({
          hostedBy: fakeTeacher._id,
          reservedBy: fakeTeacher._id,
          packageId: fakeTeacher.teacherData.packages[0]._id,
          reservationLength: 60,
          remainingAppointments: 5,
          transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
          lessonLanguage: 'ja',
          isSubscription: false,
          paymentMethodData: {},
        });
        expect(fakePackageTransaction.lessonLanguage).to.equal('ja');
        expect(fakePackageTransaction.isSubscription).to.equal(false);
        expect(fakePackageTransaction.packageData).to.deep.equal(
          fakeTeacher.teacherData.packages[0]
        );
        expect(fakePackageTransaction.hostedByData).to.deep.equal(fakeTeacher);
        expect(fakePackageTransaction.reservedByData).to.deep.equal(fakeTeacher);
      });
    });
    context('given invalid inputs', () => {
      it('should throw an error', async () => {
        try {
          const entityData: any = {};
          const fakePackageTransaction = await packageTransactionEntity.build(entityData);
        } catch (err) {
          expect(err).to.be.an('error');
        }
      });
    });
  });
});
