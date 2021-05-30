import chai from 'chai';
import { teacherEntity } from './index';

const expect = chai.expect;

describe('teacher entity', () => {
  describe('given valid inputs', () => {
    it('should get correct user id given valid inputs', () => {
      const testTeacher = teacherEntity.build({ userId: '123lsjadnasda' });
      expect(testTeacher.getUserId()).to.equal('123lsjadnasda');
    });
  });

  describe('given invalid inputs', () => {
    it('should returned undefined if provided no input', () => {
      const testTeacher = teacherEntity.build({});
      expect(typeof testTeacher.getUserId()).to.equal('undefined');
    });
  });
});
