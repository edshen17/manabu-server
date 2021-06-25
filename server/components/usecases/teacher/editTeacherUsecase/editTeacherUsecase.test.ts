import chai from 'chai';
import { JoinedUserDoc } from '../../../dataAccess/services/user/userDbService';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { EditTeacherUsecase } from './editTeacherUsecase';
import { makeEditTeacherUsecase } from '.';

const expect = chai.expect;
let fakeDbUserFactory: FakeDbUserFactory;
let controllerDataBuilder: ControllerDataBuilder;
let fakeTeacher: JoinedUserDoc;
let editTeacherUsecase: EditTeacherUsecase;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
  editTeacherUsecase = await makeEditTeacherUsecase;
});

describe('editTeacherUsecase', () => {
  describe('makeRequest', async () => {
    describe('editing teacher data', () => {
      it('should update the teacher in the db and return the correct properties (self)', async () => {
        const buildEditTeacherControllerData = controllerDataBuilder
          .currentAPIUser({
            userId: fakeTeacher._id,
            role: fakeTeacher.role,
          })
          .routeData({
            body: {
              licensePath: 'new license path',
            },
            params: {
              uId: fakeTeacher._id,
            },
            query: {},
          })
          .build();
        const editTeacherRes = await editTeacherUsecase.makeRequest(buildEditTeacherControllerData);
        if ('user' in editTeacherRes) {
          expect(editTeacherRes.user.teacherData.licensePath).to.equal('new license path');
        }
      });

      it('should deny access when updating restricted properties (self)', async () => {
        try {
          const fakeUser = await fakeDbUserFactory.createFakeDbUser();
          const buildEditTeacherControllerData = controllerDataBuilder
            .currentAPIUser({
              userId: fakeTeacher._id,
              role: fakeTeacher.role,
            })
            .routeData({
              body: {
                userId: fakeUser._id,
              },
              params: {
                uId: fakeTeacher._id,
              },
              query: {},
            })
            .build();
          const editTeacherRes = await editTeacherUsecase.makeRequest(
            buildEditTeacherControllerData
          );
        } catch (err) {
          expect(err).to.be.an('error');
          expect(err.message).to.equal('Access denied.');
        }
      });
      it('should deny access when trying to update restricted properties (not self)', async () => {
        try {
          const otherFakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
          const buildEditTeacherControllerData = controllerDataBuilder
            .currentAPIUser({
              userId: fakeTeacher._id,
              role: fakeTeacher.role,
            })
            .routeData({
              body: {
                userId: 'new user id',
              },
              params: {
                uId: otherFakeTeacher._id,
              },
              query: {},
            })
            .build();
          const editTeacherRes = await editTeacherUsecase.makeRequest(
            buildEditTeacherControllerData
          );
        } catch (err) {
          expect(err).to.be.an('error');
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
