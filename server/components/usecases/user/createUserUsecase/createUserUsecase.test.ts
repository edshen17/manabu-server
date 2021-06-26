import faker from 'faker';
import { expect } from 'chai';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { CreateUserUsecase } from './createUserUsecase';
import { makeCreateUserUsecase } from '.';

let controllerDataBuilder: ControllerDataBuilder;
let createUserUsecase: CreateUserUsecase;
let defaultRouteData: RouteData;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createUserUsecase = await makeCreateUserUsecase;
});

beforeEach(async () => {
  defaultRouteData = {
    params: {},
    body: { name: faker.name.findName(), email: faker.internet.email() },
    query: {},
  };
});

context('createUserUsecase', () => {
  describe('makeRequest', () => {
    describe('creating a new user should return the correct properties', () => {
      it('should create a new user in the db', async () => {
        const buildNewUserControllerData = controllerDataBuilder
          .routeData(defaultRouteData)
          .build();

        const newUserRes = await createUserUsecase.makeRequest(buildNewUserControllerData);
        if ('user' in newUserRes!) {
          expect(newUserRes.user._id).to.not.equal('');
        }
      });
      it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
        defaultRouteData.body.isTeacherApp = true;
        const buildNewUserControllerData = controllerDataBuilder
          .routeData(defaultRouteData)
          .build();
        const newTeacherRes = await createUserUsecase.makeRequest(buildNewUserControllerData);
        if ('user' in newTeacherRes!) {
          expect(newTeacherRes.user).to.have.property('settings');
          expect(newTeacherRes.user).to.not.have.property('password');
          expect(newTeacherRes.user.teacherData).to.have.property('licensePath');
        }
      });
      it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
        defaultRouteData.body.isTeacherApp = true;
        const buildNewUserControllerData = controllerDataBuilder
          .routeData(defaultRouteData)
          .currentAPIUser({ role: 'admin' })
          .build();

        const newTeacherRes = await createUserUsecase.makeRequest(buildNewUserControllerData);
        if ('user' in newTeacherRes!) {
          expect(newTeacherRes.user).to.have.property('settings');
          expect(newTeacherRes.user).to.not.have.property('password');
          expect(newTeacherRes.user.teacherData).to.have.property('licensePath');
          expect(newTeacherRes.user.teacherData.packages.length).to.equal(3);
        }
      });
    });
  });
});
