import chai from 'chai';
import { makeTeacherBalanceEntity } from './index';

const expect = chai.expect;
context('teacherBalance entity', () => {
  describe('build', () => {
    describe('given valid inputs', () => {
      it('should return given inputs', () => {
        const testTeacherBalance = makeTeacherBalanceEntity.build({
          userId: 'some userId',
        });
        expect(testTeacherBalance.userId).to.equal('some userId');
      });
    });
  });
});
