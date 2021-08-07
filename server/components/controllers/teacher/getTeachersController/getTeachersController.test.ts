import { expect } from 'chai';
import { makeGetTeachersController } from '.';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { QueryStringHandler } from '../../../usecases/utils/queryStringHandler/queryStringHandler';
import { makeIHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetTeachersController } from './getTeachersController';

let fakeDbUserFactory: FakeDbUserFactory;
let iHttpRequestBuilder: IHttpRequestBuilder;
let getTeachersController: GetTeachersController;
let queryStringHandler: QueryStringHandler;
let userDbService: UserDbService;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getTeachersController = await makeGetTeachersController;
  queryStringHandler = makeQueryStringHandler;
  userDbService = await makeUserDbService;
});

describe('getTeachersController', () => {
  describe('makeRequest', () => {
    it('should get teachers from the filter', async () => {
      const fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
      const dbServiceAccessOptions = userDbService.getBaseDbServiceAccessOptions();
      await userDbService.findOneAndUpdate({
        searchQuery: { _id: fakeTeacher._id },
        updateQuery: {
          role: 'teacher',
          'teacherData.applicationStatus': 'approved',
          'teacherData.teacherType': 'licensed',
        },
        dbServiceAccessOptions,
      });
      const filter = queryStringHandler.encodeQueryStringObj({
        teacherType: ['unlicensed', 'licensed'],
        contactMethodName: ['Skype', 'LINE'],
        contactMethodType: ['online', 'offline'],
      });
      const query = queryStringHandler.parseQueryString(filter);
      const getTeachersHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeTeacher._id,
          role: fakeTeacher.role,
        })
        .query(query)
        .build();
      const getTeachersRes = await getTeachersController.makeRequest(getTeachersHttpRequest);
      expect(getTeachersRes.statusCode).to.equal(200);
      if ('teachers' in getTeachersRes.body) {
        expect(getTeachersRes.body.teachers.length > 0).to.equal(true);
      }
    });
    it('should not throw an error if no teacher is found', async () => {
      const getTeachersHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: undefined,
          role: 'user',
        })
        .build();
      const getUserRes = await getTeachersController.makeRequest(getTeachersHttpRequest);
      expect(getUserRes.statusCode).to.equal(200);
    });
  });
});
