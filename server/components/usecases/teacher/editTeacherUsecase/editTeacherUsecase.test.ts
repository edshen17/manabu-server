import { expect } from 'chai';
import { makeEditTeacherUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { EditTeacherUsecase } from './editTeacherUsecase';

let fakeDbUserFactory: FakeDbUserFactory;
let controllerDataBuilder: ControllerDataBuilder;
let fakeTeacher: JoinedUserDoc;
let editTeacherUsecase: EditTeacherUsecase;
let routeData: RouteData;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
  editTeacherUsecase = await makeEditTeacherUsecase;
});

beforeEach(() => {
  routeData = {
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
    describe('editing teacher data', () => {
      it('should update the teacher in the db and return the correct properties (self)', async () => {
        const buildEditTeacherControllerData = controllerDataBuilder
          .currentAPIUser({
            userId: fakeTeacher._id,
            role: fakeTeacher.role,
            teacherId: fakeTeacher.teacherData!._id,
          })
          .routeData(routeData)
          .build();
        const editTeacherRes = await editTeacherUsecase.makeRequest(buildEditTeacherControllerData);
        expect(editTeacherRes).to.have.property('user');
        if ('user' in editTeacherRes) {
          expect(editTeacherRes.user.teacherData!.licensePathUrl).to.equal(
            'https://fakeimg.pl/300/'
          );
        }
      });
      it('should deny access when updating restricted properties (self)', async () => {
        try {
          const fakeUser = await fakeDbUserFactory.createFakeDbUser();
          const buildEditTeacherControllerData = controllerDataBuilder
            .currentAPIUser({
              userId: fakeUser._id,
              role: fakeUser.role,
            })
            .routeData(routeData)
            .build();
          const editTeacherRes = await editTeacherUsecase.makeRequest(
            buildEditTeacherControllerData
          );
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
      it('should deny access when trying to update restricted properties (not self)', async () => {
        try {
          const otherFakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
          routeData.params.teacherId = otherFakeTeacher._id;
          const buildEditTeacherControllerData = controllerDataBuilder.routeData(routeData).build();
          const editTeacherRes = await editTeacherUsecase.makeRequest(
            buildEditTeacherControllerData
          );
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
      it('should deny access with not logged in', async () => {
        try {
          const buildEditTeacherControllerData = controllerDataBuilder
            .currentAPIUser({
              userId: undefined,
              role: 'user',
            })
            .routeData(routeData)
            .build();
          const editTeacherRes = await editTeacherUsecase.makeRequest(
            buildEditTeacherControllerData
          );
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
