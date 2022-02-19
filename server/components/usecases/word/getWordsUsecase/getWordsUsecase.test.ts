import { expect } from 'chai';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetWordsUsecase } from './getWordsUsecase';
import { makeGetWordsUsecase } from './index';

let getWordsUsecase: GetWordsUsecase;
let controllerDataBuilder: ControllerDataBuilder;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  getWordsUsecase = await makeGetWordsUsecase;
  controllerDataBuilder = makeControllerDataBuilder;
});

beforeEach(async () => {
  routeData = {
    rawBody: {},
    headers: {},
    params: {
      word: 'kayoubi',
    },
    body: {},
    query: {
      wordLanguage: 'ja',
      definitionLanguage: 'ja',
      page: 0,
      limit: 25,
    },
    endpointPath: '',
  };
  currentAPIUser = {
    userId: undefined,
    teacherId: undefined,
    role: 'user',
  };
});

describe('getWordsUsecase', () => {
  describe('makeRequest', () => {
    it('should return entries of the searched word', async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const { words } = await getWordsUsecase.makeRequest(controllerData);
      expect(words.length > 0).to.equal(true);
    });
  });
});
