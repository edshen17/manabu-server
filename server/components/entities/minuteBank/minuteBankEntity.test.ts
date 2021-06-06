import chai from 'chai';
import { createFakeDbUser } from '../../dataAccess/services/usersDb.test';
import { makeMinuteBankEntity } from './index';

const expect = chai.expect;
const assert = chai.assert;
context('minuteBank entity', () => {
  describe('build', () => {
    describe('given valid inputs', () => {
      it('should return given inputs', async () => {
        const minuteBankEntity = await makeMinuteBankEntity;
        const fakeHostedBy = await createFakeDbUser(false);
        const fakeReservedBy = await createFakeDbUser(false);
        const testMinuteBank = await minuteBankEntity.build({
          hostedBy: fakeHostedBy._id,
          reservedBy: fakeReservedBy._id,
          minuteBank: 5,
        });
        expect(testMinuteBank.hostedBy).to.equal(fakeHostedBy._id);
        expect(testMinuteBank.reservedBy).to.equal(fakeReservedBy._id);
        expect(testMinuteBank.minuteBank).to.equal(5);
        expect(testMinuteBank).to.have.property('hostedByData');
        expect(testMinuteBank).to.have.property('reservedByData');
      });
    });
  });
});
