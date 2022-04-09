import { expect } from 'chai';
import { makeGetPendingTeachersUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetPendingTeachersUsecase } from './getPendingTeachersUsecase';

let getPendingTeachersUsecase: GetPendingTeachersUsecase;
let fakeDbUserFactory: FakeDbUserFactory;
let teacherDbService: TeacherDbService;
let controllerDataBuilder: ControllerDataBuilder;
let fakeTeacher: JoinedUserDoc;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  getPendingTeachersUsecase = await makeGetPendingTeachersUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
  teacherDbService = await makeTeacherDbService;
});

beforeEach(async () => {
  const dbServiceAccessOptions = teacherDbService.getBaseDbServiceAccessOptions();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  await teacherDbService.findOneAndUpdate({
    searchQuery: { _id: fakeTeacher.teacherData!._id },
    updateQuery: { applicationStatus: 'pending' },
    dbServiceAccessOptions,
  });
  routeData = {
    rawBody: {},
    headers: {},
    params: {},
    body: {},
    query: {},
    endpointPath: '/admin/getPendingTeachers',
    cookies: {},
  };
  currentAPIUser = {
    userId: fakeTeacher._id,
    role: 'admin',
  };
});

describe('getPendingTeachersUsecase', () => {
  describe('makeRequest', () => {
    const getPendingTeachers = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getTeachersRes = await getPendingTeachersUsecase.makeRequest(controllerData);
      const pendingTeachers = getTeachersRes.teachers;
      return pendingTeachers;
    };

    const testPendingTeachers = (pendingTeachers: JoinedUserDoc[]) => {
      expect(pendingTeachers.length > 0);
      for (const pendingTeacher of pendingTeachers) {
        expect(pendingTeacher.teacherData!.applicationStatus == 'pending');
      }
    };

    const testTeacherError = async () => {
      let error;
      try {
        await getPendingTeachers();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if invalid input is given', async () => {
          routeData.query = {
            lessonDurations: ['a', 'b'],
          };
          await testTeacherError();
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('as a user', () => {
            it('should throw an error', async () => {
              currentAPIUser.role = 'user';
              await testTeacherError();
            });
          });
          context('as a teacher', () => {
            it('should throw an error', async () => {
              currentAPIUser.role = 'teacher';
              await testTeacherError();
            });
          });
          context('as an unlogged-in user', async () => {
            it('should get the teachers and return a restricted view', async () => {
              currentAPIUser = { role: 'user', userId: undefined };
              await testTeacherError();
            });
          });
        });
        context('as an admin', () => {
          it('should get the teachers and return a less restricted view', async () => {
            const savedDbTeachers = await getPendingTeachers();
            testPendingTeachers(savedDbTeachers);
          });
        });
      });
    });
  });
});
