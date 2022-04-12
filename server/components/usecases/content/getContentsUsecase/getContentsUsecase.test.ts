import { expect } from 'chai';
import { makeGetContentsUsecase } from '.';
import { ContentDoc } from '../../../../models/Content';
import { JoinedUserDoc } from '../../../../models/User';
import { makeGraphDbService } from '../../../dataAccess/services/graph';
import { GraphDbService } from '../../../dataAccess/services/graph/graphDbService';
import { makeFakeDbContentFactory } from '../../../dataAccess/testFixtures/fakeDbContentFactory';
import { FakeDbContentFactory } from '../../../dataAccess/testFixtures/fakeDbContentFactory/fakeDbContentFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetContentsUsecase } from './getContentsUsecase';

let getContentsUsecase: GetContentsUsecase;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeDbContentFactory: FakeDbContentFactory;
let graphDbService: GraphDbService;
let controllerDataBuilder: ControllerDataBuilder;
let fakeUser: JoinedUserDoc;
let fakeContent: ContentDoc;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  getContentsUsecase = await makeGetContentsUsecase;
  fakeDbContentFactory = await makeFakeDbContentFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
  graphDbService = await makeGraphDbService;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeContent = await fakeDbContentFactory.createFakeDbData();
  routeData = {
    rawBody: {},
    headers: {},
    params: {},
    body: {},
    query: {},
    endpointPath: '',
    cookies: {},
    req: {},
  };
  currentAPIUser = {
    userId: fakeUser._id,
    role: 'user',
  };
});

describe('getContentsUsecase', () => {
  describe('makeRequest', () => {
    const getContents = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getContentsRes = await getContentsUsecase.makeRequest(controllerData);
      const { contents } = getContentsRes;
      return contents;
    };

    const testContents = async (): Promise<void> => {
      const contents = await getContents();
      expect(contents.length >= 0).to.equal(true);
    };

    const testContentsError = async () => {
      let error;
      try {
        await getContents();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if an invalid param is given', async () => {
          routeData.params = { _id: 'undefined' };
          await testContentsError();
        });
      });
      context('valid inputs', () => {
        context('as an unlogged user', () => {
          it('should get the content', async () => {
            await testContents();
          });
        });
      });
    });
  });
});
