import chai from 'chai';
import { makeTeacherDbService } from '.';
import { AccessOptions } from '../../abstractions/IDbOperations';
import { makeFakeDbTeacherFactory } from '../../testFixtures/fakeDbTeacherFactory';
import { FakeDbTeacherFactory } from '../../testFixtures/fakeDbTeacherFactory/fakeDbTeacherFactory';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { JoinedUserDoc } from '../user/userDbService';
import { TeacherDbService } from './teacherDbService';

const expect = chai.expect;

let teacherDbService: TeacherDbService;
let fakeDbTeacherFactory: FakeDbTeacherFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let accessOptions: AccessOptions;
let fakeUser: JoinedUserDoc;

before(async () => {
  teacherDbService = await makeTeacherDbService;
  fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  accessOptions = fakeDbTeacherFactory.getDefaultAccessOptions();
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
});

describe('teacherDbService', () => {
  describe('findById, findOne, and find', () => {
    it('should return a teacher with the correct restricted properties (user, not self)', async () => {
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData({ userId: fakeUser._id });
      const findByIdTeacher = await teacherDbService.findById({
        _id: fakeUser._id,
        accessOptions,
      });
      const findOneTeacher = await teacherDbService.findOne({
        searchQuery: { userId: fakeUser._id },
        accessOptions,
      });
      const findTeachers = await teacherDbService.find({
        searchQuery: { userId: fakeUser._id },
        accessOptions,
      });
      expect(findByIdTeacher).to.deep.equal(newTeacher);
      expect(findByIdTeacher).to.deep.equal(findOneTeacher);
      expect(findTeachers.length).to.equal(1);
      expect(findByIdTeacher).to.deep.equal(findTeachers[0]);
      expect(findByIdTeacher).to.not.have.property('licensePath');
    });
    it('should return a teacher with restricted properties (user, self)', async () => {
      accessOptions.isSelf = true;
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData({ userId: fakeUser._id });
      const findByIdTeacher = await teacherDbService.findById({
        _id: newTeacher.userId,
        accessOptions,
      });
      expect(findByIdTeacher).to.have.property('licensePath');
    });
    it('should return a teacher with restricted properties (admin, not self)', async () => {
      accessOptions.currentAPIUserRole = 'admin';
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData({ userId: fakeUser._id });
      const findByIdTeacher = await teacherDbService.findById({
        _id: newTeacher.userId,
        accessOptions,
      });
      expect(findByIdTeacher).to.have.property('licensePath');
    });
    it('should return null when no teacher found', async () => {
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData({ userId: fakeUser._id });
      const findByIdTeacher = await teacherDbService.findById({
        _id: newTeacher._id,
        accessOptions,
      });
      expect(findByIdTeacher).to.equal(null);
    });
  });
});
