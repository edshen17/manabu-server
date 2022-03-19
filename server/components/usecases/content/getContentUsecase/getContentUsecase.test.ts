import { expect } from 'chai';
import { makeGetContentUsecase } from '.';
import { ContentDoc } from '../../../../models/Content';
import { makeFakeDbContentFactory } from '../../../dataAccess/testFixtures/fakeDbContentFactory';
import { FakeDbContentFactory } from '../../../dataAccess/testFixtures/fakeDbContentFactory/fakeDbContentFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetContentUsecase } from './getContentUsecase';

let getContentUsecase: GetContentUsecase;
let controllerDataBuilder: ControllerDataBuilder;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakeDbContentFactory: FakeDbContentFactory;
let fakeContent: ContentDoc;

before(async () => {
  getContentUsecase = await makeGetContentUsecase;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeDbContentFactory = await makeFakeDbContentFactory;
});

beforeEach(async () => {
  fakeContent = await fakeDbContentFactory.createFakeDbData();
  routeData = {
    rawBody: {},
    headers: {},
    params: {
      contentId: fakeContent._id,
    },
    body: {},
    query: {},
    endpointPath: '',
  };
  currentAPIUser = {
    userId: undefined,
    role: 'user',
  };
});

describe('getContentUsecase', () => {
  describe('makeRequest', () => {
    const getContent = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getContentRes = await getContentUsecase.makeRequest(controllerData);
      const { content } = getContentRes;
      return content;
    };

    const testContent = async () => {
      const content = await getContent();
      expect(content._id).to.deep.equal(fakeContent._id);
    };

    const testContentError = async () => {
      let error;
      try {
        await getContent();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if an invalid id is given', async () => {
          routeData.params = {
            hostedById: 'some id',
          };
          await testContentError();
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should get the content', async () => {
              await testContent();
            });
          });
        });
      });
    });
  });
});
