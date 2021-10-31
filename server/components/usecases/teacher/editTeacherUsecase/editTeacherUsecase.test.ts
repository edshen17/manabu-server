import { expect } from 'chai';
import { makeEditTeacherUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { EditTeacherUsecase } from './editTeacherUsecase';

let fakeDbUserFactory: FakeDbUserFactory;
let controllerDataBuilder: ControllerDataBuilder;
let fakeTeacher: JoinedUserDoc;
let editTeacherUsecase: EditTeacherUsecase;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  editTeacherUsecase = await makeEditTeacherUsecase;
});

beforeEach(() => {
  currentAPIUser = {
    userId: fakeTeacher._id,
    teacherId: fakeTeacher.teacherData!._id,
    role: fakeTeacher.role,
  };
  routeData = {
    headers: {},
    body: {
      licensePathUrl: 'https://fakeimg.pl/300/',
    },
    params: {
      teacherId: fakeTeacher.teacherData!._id,
    },
    query: {},
    endpointPath: '',
  };
});

describe('editTeacherUsecase', () => {
  describe('makeRequest', async () => {
    const editTeacher = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const editTeacherRes = await editTeacherUsecase.makeRequest(controllerData);
      const editedTeacher = editTeacherRes.user;
      return editedTeacher;
    };
    const testTeacherError = async () => {
      let error;
      try {
        error = await editTeacher();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };

    describe('editing teacher data', () => {
      it('should update the teacher in the db and return the correct properties (self)', async () => {
        const editedTeacher = await editTeacher();
        expect(editedTeacher.teacherData!.licensePathUrl).to.equal('https://fakeimg.pl/300/');
      });
      it('should deny access when updating restricted properties (self)', async () => {
        routeData.body = {
          createdDate: new Date(),
        };
        await testTeacherError();
      });
      it('should deny access when trying to update restricted properties (not self)', async () => {
        const otherFakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
        routeData.params.teacherId = otherFakeTeacher.teacherData!._id;
        await testTeacherError();
      });
      it('should deny access with not logged in', async () => {
        currentAPIUser.userId = undefined;
        currentAPIUser.teacherId = undefined;
        await testTeacherError();
      });
    });
  });
});
