import { expect } from 'chai';
import { makeTeacherBalanceEntity } from './index';
import { TeacherBalanceEntity } from './teacherBalanceEntity';

let teacherBalanceEntity: TeacherBalanceEntity;

before(async () => {
  teacherBalanceEntity = await makeTeacherBalanceEntity;
});

describe('teacherBalance entity', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should return given inputs', () => {
        const testTeacherBalance = teacherBalanceEntity.build({
          userId: 'some userId',
        });
        expect(testTeacherBalance.userId).to.equal('some userId');
      });
    });
  });
});
