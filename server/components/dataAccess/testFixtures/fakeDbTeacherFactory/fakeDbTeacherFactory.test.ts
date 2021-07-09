import { expect } from 'chai';
import { makeFakeDbTeacherFactory } from '.';
import { makeTeacherDbService } from '../../services/teacher';
import { TeacherDbService } from '../../services/teacher/teacherDbService';
import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';
import { FakeDbTeacherFactory } from './fakeDbTeacherFactory';

let teacherDbService: TeacherDbService;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeDbTeacherFactory: FakeDbTeacherFactory;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
  teacherDbService = await makeTeacherDbService;
});

describe('fakeDbTeacherFactory', () => {
  describe('createFakeDbData', () => {
    it('should create a fake teacher in the db', async () => {
      const newUser = await fakeDbUserFactory.createFakeDbUser();
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData({
        userId: newUser._id.toString(),
      });
      expect(newTeacher.userId.toString()).to.equal(newUser._id.toString());
    });
  });
});
