import { expect } from 'chai';
import { makeFakeDbTeacherFactory } from '.';
import { makeTeacherDbService } from '../../services/teacher';
import { TeacherDbService } from '../../services/teacher/teacherDbService';
import { FakeDbTeacherFactory } from './fakeDbTeacherFactory';

let teacherDbService: TeacherDbService;
let fakeDbTeacherFactory: FakeDbTeacherFactory;

before(async () => {
  fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
  teacherDbService = await makeTeacherDbService;
});

describe('fakeDbTeacherFactory', () => {
  describe('createFakeDbData', () => {
    it('should create a fake teacher in the db', async () => {
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData();
      expect(newTeacher).to.have.property('_id');
      expect(newTeacher.packages.length).to.equal(3);
    });
  });
});
