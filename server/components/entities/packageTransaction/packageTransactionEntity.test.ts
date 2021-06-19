import chai from 'chai';
import { makeFakeDbUserGenerator } from '../../dataAccess/testFixtures';
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
      it('should return given inputs asdsada', async () => {
        const fakeTeacher = await fakeDbUserGenerator.createFakeDbTeacherWithDefaultPackages();
        console.log(fakeTeacher, 'hereeee');
        // const testPackageTransaction = await packageTransactionEntity.build({
        //   hostedBy: fakeTeacher._id,
        //   reservedBy: fakeTeacher._id,
        //   packageId: fakeTeacher.teacherData.packages[0]._id,
        //   reservationLength: 60,
        //   remainingAppointments: 5,
        //   transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
        // });
        // console.log(testPackageTransaction, 'here');
        // expect(testPackageTransaction.hostedBy).to.equal(fakeTeacher._id);
        // expect(testPackageTransaction.reservedBy).to.equal(fakeTeacher._id);
        // expect(testPackageTransaction).to.have.property('hostedByData');
        // console.log(testPackageTransaction);
      });
    });
  });
});
