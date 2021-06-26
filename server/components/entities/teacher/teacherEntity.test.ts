import { expect } from 'chai';
import { makeTeacherEntity } from '.';

describe('teacher entity', () => {
  describe('build', () => {
    it('should create a teacher with the given user id', () => {
      const testTeacher = makeTeacherEntity.build({ userId: 'random user id' });
      expect(testTeacher.userId).to.equal('random user id');
      expect(testTeacher.isApproved).to.equal(false);
      expect(testTeacher.hourlyRate).to.deep.equal({ amount: 35, currency: 'SGD' });
    });
  });
});
