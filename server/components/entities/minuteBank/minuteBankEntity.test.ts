import chai from 'chai';
import { makeMinuteBankEntity } from './index';

const expect = chai.expect;
const assert = chai.assert;
context('minuteBank entity', () => {
  describe('build', () => {
    describe('given valid inputs', () => {
      it('should return given inputs', () => {
        const testMinuteBank = makeMinuteBankEntity.build({
          hostedBy: 'some hostedBy',
          reservedBy: 'some reservedBy',
          minuteBank: 5,
        });
        expect(testMinuteBank.hostedBy).to.equal('some hostedBy');
        expect(testMinuteBank.reservedBy).to.equal('some reservedBy');
        expect(testMinuteBank.minuteBank).to.equal(5);
      });
    });
  });
});
