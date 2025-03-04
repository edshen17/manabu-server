import { expect } from 'chai';
import { makeControllerDataBuilder } from '.';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { ControllerDataBuilder } from './controllerDataBuilder';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

describe('controllerDataBuilder', () => {
  describe('build', () => {
    it('should build a valid ControllerData object with a random current API user', async () => {
      const fakeUser = await fakeDbUserFactory.createFakeDbUser();
      const testCurrentAPIUser = {
        userId: fakeUser._id,
        role: fakeUser.role,
      };
      const controllerData = controllerDataBuilder.currentAPIUser(testCurrentAPIUser).build();
      expect(controllerData.currentAPIUser).to.deep.equal(testCurrentAPIUser);
      expect(controllerData.routeData).to.deep.equal({
        params: {},
        body: {},
        headers: {},
        query: {},
        endpointPath: '',
        rawBody: {},
        cookies: {},
        req: {},
      });
    });
    it('should build a valid ControllerData object with an empty current API user and a non-empty routeData object', async () => {
      const testRouteData = {
        params: {
          uId: 'some uid',
        },
        body: {
          isTeacherApp: false,
        },
        query: {
          query: 'some query',
        },
        endpointPath: '',
        headers: {},
        rawBody: {},
        cookies: {},
        req: {},
      };
      const controllerData = await controllerDataBuilder.routeData(testRouteData).build();
      expect(controllerData.currentAPIUser).to.deep.equal({
        userId: undefined,
        role: 'user',
      });
      expect(controllerData.routeData).to.deep.equal(testRouteData);
    });
  });
});
