import chai from 'chai';
import { packageTransactionEntity } from './index';

const expect = chai.expect;
const assert = chai.assert;
context('packageTransaction entity', () => {
  describe('build', () => {
    describe('given valid inputs', () => {
      it('should return given inputs', () => {
        const testPackageTransaction = packageTransactionEntity.build({
          hostedBy: 'some hostedBy',
          reservedBy: 'some reservedBy',
          packageId: 'some packageId',
          reservationLength: 60,
          terminationDate: new Date(),
          remainingAppointments: 5,
          lessonLanguage: 'ja',
          isSubscription: false,
        });
        expect(testPackageTransaction.getHostedBy()).to.equal('some hostedBy');
        expect(testPackageTransaction.getReservedBy()).to.equal('some reservedBy');
        expect(testPackageTransaction.getPackageId()).to.equal('some packageId');
        expect(testPackageTransaction.getReservationLength()).to.equal(60);
        expect(testPackageTransaction.getRemainingAppointments()).to.equal(5);
        expect(testPackageTransaction.getLessonLanguage()).to.equal('ja');
        expect(testPackageTransaction.getIsSubscription()).to.equal(false);
        assert.deepEqual(testPackageTransaction.getTerminationDate(), new Date());
      });
    });

    describe('given invalid inputs', () => {
      it('should returned undefined if provided no input', () => {
        const testPackageTransaction = packageTransactionEntity.build({});
        expect(typeof testPackageTransaction.getHostedBy()).to.equal('undefined');
      });
    });
  });
});
