import chai from 'chai';
import { makeTeacherEntity } from './index';

const expect = chai.expect;

describe('teacher entity', () => {
  describe('given valid inputs', () => {
    it('should get correct user id given valid inputs', () => {
      const testTeacher = makeTeacherEntity.build({ userId: '123lsjadnasda' });
      expect(testTeacher.userId).to.equal('123lsjadnasda');
    });
  });

  describe('given invalid inputs', () => {
    it('should returned undefined if provided no input', () => {
      const testTeacher = makeTeacherEntity.build({});
      expect(typeof testTeacher.userId).to.equal('undefined');
    });
  });
});
