import chai from 'chai';
import { createFakeDbUser } from '../../dataAccess/services/usersDb.test';
import { makePackageTransactionEntity } from './index';

const expect = chai.expect;
const assert = chai.assert;
let packageTransactionEntity: any;
context('packageTransaction entity', () => {
  describe('build', async () => {
    packageTransactionEntity = await makePackageTransactionEntity;
    describe('given valid inputs', () => {
      it('should return given inputs', async () => {
        const fakeUser = await createFakeDbUser(true);
        const testPackageTransaction = await packageTransactionEntity.build({
          hostedBy: fakeUser._id,
          reservedBy: fakeUser._id,
          packageId: fakeUser._id, // change to package id
          reservationLength: 60,
          remainingAppointments: 5,
        });
        expect(testPackageTransaction.hostedBy).to.equal(fakeUser._id);
        expect(testPackageTransaction.reservedBy).to.equal(fakeUser._id);
        expect(testPackageTransaction).to.have.property('hostedByData');
        expect(testPackageTransaction.reservationLength).to.equal(60);
        expect(testPackageTransaction.remainingAppointments).to.equal(5);
        expect(testPackageTransaction.lessonLanguage).to.equal('ja');
        expect(testPackageTransaction.isSubscription).to.equal(false);
        expect(testPackageTransaction.terminationDate).to.be.an('date');
      });
    });

    describe('given invalid inputs', () => {
      it('should returned undefined if provided no input', () => {
        const testPackageTransaction = packageTransactionEntity.build({});
        expect(typeof testPackageTransaction.hostedBy).to.equal('undefined');
      });
    });
  });
});
