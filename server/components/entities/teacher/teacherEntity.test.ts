import { expect } from 'chai';
import { makeTeacherEntity } from '.';
import { TeacherEntity } from './teacherEntity';

let teacherEntity: TeacherEntity;

before(async () => {
  teacherEntity = await makeTeacherEntity;
});

describe('teacher entity', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should create a teacher with the given user id', () => {
        const fakeTeacher = teacherEntity.build({ userId: '60e85b368b7a302a040981ce' });
        if ('userId' in fakeTeacher) {
          expect(fakeTeacher.userId.toString()).to.equal('60e85b368b7a302a040981ce');
          expect(fakeTeacher.isApproved).to.equal(false);
          expect(fakeTeacher.hourlyRate).to.deep.equal({ amount: 35, currency: 'SGD' });
        }
      });
    });
  });
});
