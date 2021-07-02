import { expect } from 'chai';
import { makeTeacherEntity } from '.';

describe('teacher entity', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should create a teacher with the given user id', () => {
        const fakeTeacher = makeTeacherEntity.build({ userId: 'random user id' });
        expect(fakeTeacher.userId).to.equal('random user id');
        expect(fakeTeacher.isApproved).to.equal(false);
        expect(fakeTeacher.hourlyRate).to.deep.equal({ amount: 35, currency: 'SGD' });
      });
    });
  });
});
