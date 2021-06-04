import chai from 'chai';
import { minuteBankEntity } from './index';

const expect = chai.expect;
const assert = chai.assert;
context('minuteBank entity', () => {
  describe('build', () => {
    describe('given valid inputs', () => {
      it('should return given inputs', () => {
        const testMinuteBank = minuteBankEntity.build({
          hostedBy: 'some hostedBy',
          reservedBy: 'some reservedBy',
          minuteBank: 5,
        });
        expect(testMinuteBank.hostedBy).to.equal('some hostedBy');
        expect(testMinuteBank.reservedBy).to.equal('some reservedBy');
        expect(testMinuteBank.minuteBank).to.equal(5);
      });
    });

    describe('given invalid inputs', () => {
      it('should returned undefined if provided no input', () => {
        const testMinuteBank = minuteBankEntity.build({});
        expect(typeof testMinuteBank.hostedBy).to.equal('undefined');
      });
    });
  });
});
