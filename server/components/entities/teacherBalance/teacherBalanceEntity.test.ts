import chai from 'chai';
import { teacherBalanceEntity } from './index';

const expect = chai.expect;
context('teacherBalance entity', () => {
  describe('build', () => {
    describe('given valid inputs', () => {
      it('should return given inputs', () => {
        const testTeacherBalance = teacherBalanceEntity.build({
          userId: 'some userId',
        });
        expect(testTeacherBalance.userId).to.equal('some userId');
      });
    });

    describe('given invalid inputs', () => {
      it('should returned undefined if provided no input', () => {
        const testTeacherBalance = teacherBalanceEntity.build({});
        expect(typeof testTeacherBalance.userId).to.equal('undefined');
      });
    });
  });
});
