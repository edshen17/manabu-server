import chai from 'chai';
import { makeTeacherEntity } from '.';

const expect = chai.expect;

describe('teacher entity', () => {
  describe('given valid inputs', () => {
    it('should get correct user id given valid inputs', () => {
      const testTeacher = makeTeacherEntity.build({ userId: '123lsjadnasda' });
      expect(testTeacher.userId).to.equal('123lsjadnasda');
    });
  });
});
