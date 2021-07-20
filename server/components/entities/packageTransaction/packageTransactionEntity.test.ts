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
          hostedById: fakeTeacher._id,
          reservedById: fakeTeacher._id,
          packageId: fakeTeacher.teacherData!.packages[0]._id,
          lessonDuration: 60,
          remainingAppointments: 5,
          priceData: { currency: 'SGD', subTotal: 0, total: 0 },
          lessonLanguage: 'ja',
          isSubscription: false,
          paymentData: {},
        });
        expect(fakePackageTransaction.lessonLanguage).to.equal('ja');
        expect(fakePackageTransaction.isSubscription).to.equal(false);
        expect(fakePackageTransaction.packageData).to.deep.equal(
          fakeTeacher.teacherData!.packages[0]
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
