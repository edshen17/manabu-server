import chai from 'chai';
import { makeTeacherEntity } from '.';

const expect = chai.expect;
const assert = chai.assert;

describe('teacher entity', () => {
  describe('build', () => {
    it('should create a teacher with the given user id', () => {
      const testTeacher = makeTeacherEntity.build({ userId: 'random user id' });
      expect(testTeacher.userId).to.equal('random user id');
      expect(testTeacher.isApproved).to.equal(false);
      assert.deepEqual(testTeacher.hourlyRate, { amount: 35, currency: 'SGD' });
    });
  });
});
