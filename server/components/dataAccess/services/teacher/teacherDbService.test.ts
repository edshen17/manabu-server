import { expect } from 'chai';
import { makeTeacherDbService } from '.';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbTeacherFactory } from '../../testFixtures/fakeDbTeacherFactory';
import { FakeDbTeacherFactory } from '../../testFixtures/fakeDbTeacherFactory/fakeDbTeacherFactory';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { JoinedUserDoc } from '../user/userDbService';
import { TeacherDbService } from './teacherDbService';

let teacherDbService: TeacherDbService;
let fakeDbTeacherFactory: FakeDbTeacherFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let dbServiceAccessOptions: DbServiceAccessOptions;
let fakeUser: JoinedUserDoc;

before(async () => {
  teacherDbService = await makeTeacherDbService;
  fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = fakeDbTeacherFactory.getDefaultAccessOptions();
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
});

describe('teacherDbService', () => {
  describe('findById, findOne, and find', () => {
    it('should return a teacher with the correct restricted properties (user, not self)', async () => {
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData({ userId: fakeUser._id });
      const findByIdTeacher = await teacherDbService.findById({
        _id: fakeUser._id,
        dbServiceAccessOptions,
      });
      const findOneTeacher = await teacherDbService.findOne({
        searchQuery: { userId: fakeUser._id },
        dbServiceAccessOptions,
      });
      const findTeachers = await teacherDbService.find({
        searchQuery: { userId: fakeUser._id },
        dbServiceAccessOptions,
      });
      expect(findByIdTeacher).to.deep.equal(newTeacher);
      expect(findByIdTeacher).to.deep.equal(findOneTeacher);
      expect(findTeachers.length).to.equal(1);
      expect(findByIdTeacher).to.deep.equal(findTeachers[0]);
      expect(findByIdTeacher).to.not.have.property('licensePath');
    });
    it('should return a teacher with restricted properties (user, self)', async () => {
      dbServiceAccessOptions.isSelf = true;
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData({ userId: fakeUser._id });
      const findByIdTeacher = await teacherDbService.findById({
        _id: newTeacher.userId.toString(),
        dbServiceAccessOptions,
      });
      expect(findByIdTeacher).to.have.property('licensePath');
    });
    it('should return a teacher with restricted properties (admin, not self)', async () => {
      dbServiceAccessOptions.currentAPIUserRole = 'admin';
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData({ userId: fakeUser._id });
      const findByIdTeacher = await teacherDbService.findById({
        _id: newTeacher.userId.toString(),
        dbServiceAccessOptions,
      });
      expect(findByIdTeacher).to.have.property('licensePath');
    });
    it('should return null when no teacher found', async () => {
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData({ userId: fakeUser._id });
      const findByIdTeacher = await teacherDbService.findById({
        _id: newTeacher._id,
        dbServiceAccessOptions,
      });
      expect(findByIdTeacher).to.equal(null);
    });
  });
});
