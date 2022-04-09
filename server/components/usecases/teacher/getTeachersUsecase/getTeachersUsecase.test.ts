import { expect } from 'chai';
import { makeGetTeachersUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetTeachersUsecase } from './getTeachersUsecase';

let getTeachersUsecase: GetTeachersUsecase;
let fakeDbUserFactory: FakeDbUserFactory;
let controllerDataBuilder: ControllerDataBuilder;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let teacherDbService: TeacherDbService;

before(async () => {
  getTeachersUsecase = await makeGetTeachersUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
  teacherDbService = await makeTeacherDbService;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  const dbServiceAccessOptions = teacherDbService.getBaseDbServiceAccessOptions();
  await teacherDbService.findOneAndUpdate({
    searchQuery: { _id: fakeTeacher.teacherData!._id },
    updateQuery: {
      applicationStatus: 'approved',
      teacherType: 'licensed',
    },
    dbServiceAccessOptions,
  });
  routeData = {
    rawBody: {},
    headers: {},
    params: {},
    body: {},
    query: {
      // teachingLanguages: ['ja'],
      // alsoSpeaks: ['en'],
      // teacherType: ['unlicensed', 'licensed'],
      // minPrice: 30,
      // maxPrice: 40,
      // teacherTags: [],
      // packageTags: [],
      // lessonDurations: [30, 60, 90, 120],
      // contactMethodName: ['Skype', 'LINE'],
      // contactMethodType: ['online', 'offline'],
    },
    endpointPath: '',
    cookies: {},
  };
  currentAPIUser = {
    userId: fakeTeacher._id,
    role: fakeTeacher.role,
  };
});

describe('getTeachersUsecase', () => {
  describe('makeRequest', () => {
    const getTeachers = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getTeachersRes = await getTeachersUsecase.makeRequest(controllerData);
      const savedDbTeachers = getTeachersRes.teachers;
      return savedDbTeachers;
    };

    const testTeachersViews = (savedDbTeachers: JoinedUserDoc[]) => {
      for (const teacher of savedDbTeachers) {
        expect(teacher).to.not.have.property('email');
        expect(teacher).to.not.have.property('settings');
        expect(teacher).to.not.have.property('contactMethods');
        expect(teacher.teacherData).to.not.have.property('licenseUrl');
        expect(teacher).to.not.have.property('password');
        expect(teacher).to.not.have.property('verificationToken');
      }
    };

    const testTeacherError = async () => {
      let error;
      try {
        await getTeachers();
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
          context('viewing self', () => {
            it('should get the teachers and return a less restricted view', async () => {
              const savedDbTeachers = await getTeachers();
              testTeachersViews(savedDbTeachers);
            });
          });
          context('viewing other', () => {
            it('should get the teachers and return a restricted view', async () => {
              currentAPIUser.userId = fakeUser._id;
              const savedDbTeachers = await getTeachers();
              testTeachersViews(savedDbTeachers);
            });
          });
        });
        context('as an admin', () => {
          context('viewing other', () => {
            it('should get the teachers and return a less restricted view', async () => {
              currentAPIUser.userId = fakeTeacher._id;
              currentAPIUser.role = 'admin';
              const savedDbTeachers = await getTeachers();
              testTeachersViews(savedDbTeachers);
            });
          });
        });
        context('as an unlogged-in user', async () => {
          it('should get the teachers and return a restricted view', async () => {
            currentAPIUser = { role: 'user', userId: undefined };
            const savedDbTeachers = await getTeachers();
            testTeachersViews(savedDbTeachers);
          });
        });
      });
    });
  });
});
