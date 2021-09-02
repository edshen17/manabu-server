import { expect } from 'chai';
import { convertStringToObjectId } from '../utils/convertStringToObjectId';
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
          userId: convertStringToObjectId('605c5befd5eae20015bea84a'),
        });
        if ('userId' in testTeacherBalance) {
          expect(testTeacherBalance.userId.toString()).to.equal('605c5befd5eae20015bea84a');
        }
      });
    });
  });
});
