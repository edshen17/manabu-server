import { expect } from 'chai';
import { makeGetContentController } from '.';
import { ContentDoc } from '../../../../models/Content';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbContentFactory } from '../../../dataAccess/testFixtures/fakeDbContentFactory';
import { FakeDbContentFactory } from '../../../dataAccess/testFixtures/fakeDbContentFactory/fakeDbContentFactory';
import { GetContentUsecaseResponse } from '../../../usecases/content/getContentUsecase/getContentUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetContentController } from './getContentController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let getContentController: GetContentController;
let fakeDbContentFactory: FakeDbContentFactory;
let fakeContent: ContentDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getContentController = await makeGetContentController;
  fakeDbContentFactory = await makeFakeDbContentFactory;
  fakeContent = await fakeDbContentFactory.createFakeDbData();
});

beforeEach(async () => {
  params = {
    contentId: fakeContent._id,
  };
  body = {};
  currentAPIUser = {
    role: 'user',
    userId: undefined,
  };
});

describe('getContentController', () => {
  describe('makeRequest', () => {
    const getContent = async (): Promise<ControllerResponse<GetContentUsecaseResponse>> => {
      const getContentHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const getContentRes = await getContentController.makeRequest(getContentHttpRequest);
      return getContentRes;
    };
    const testValidGetContent = async (): Promise<void> => {
      const getContentRes = await getContent();
      expect(getContentRes.statusCode).to.equal(200);
      if ('content' in getContentRes.body) {
        expect(getContentRes.body.content._id).to.deep.equal(fakeContent._id);
      }
    };
    const testInvalidGetContent = async (): Promise<void> => {
      const getContentRes = await getContent();
      expect(getContentRes.statusCode).to.equal(404);
    };
    context('valid inputs', () => {
      context('as a non-admin user', () => {
        it('should get the content', async () => {
          await testValidGetContent();
        });
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        params = {
          contentId: 'some id',
        };
        await testInvalidGetContent();
      });
    });
  });
});
