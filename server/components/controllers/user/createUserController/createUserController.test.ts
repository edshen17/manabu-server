import faker from 'faker';
import { expect } from 'chai';
import { makeCreateUserController } from '.';
import { makeIHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder/IHttpRequestBuilder';
import { CreateUserController } from './createUserController';
import { QueryStringHandler } from '../../../usecases/utils/queryStringHandler/queryStringHandler';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';

let iHttpRequestBuilder: IHttpRequestBuilder;
let createUserController: CreateUserController;
let queryStringHandler: QueryStringHandler;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  createUserController = await makeCreateUserController;
  queryStringHandler = makeQueryStringHandler;
});

describe('createUserController', () => {
  describe('makeRequest', () => {
    context('valid inputs', () => {
      // it('should create a new user and return a user as well as cookies to set', async () => {
      //   const createUserHttpRequest = iHttpRequestBuilder
      //     .body({
      //       name: faker.name.findName(),
      //       password: 'St0ngP@ssword!',
      //       email: faker.internet.email(),
      //     })
      //     .path('/register')
      //     .build();
      //   const createUserRes = await createUserController.makeRequest(createUserHttpRequest);
      //   expect(createUserRes.statusCode).to.equal(201);
      //   if ('token' in createUserRes.body) {
      //     expect(createUserRes.body).to.have.property('user');
      //     expect(createUserRes.body).to.have.property('cookies');
      //   }
      // });
      it('should create a new teacher and return a teacher with cookies to set', async () => {
        const state = queryStringHandler.encodeQueryStringObj({
          state: {
            isTeacherApp: true,
          },
        });
        const query = queryStringHandler.parseQueryString(state);
        const createUserHttpRequest = iHttpRequestBuilder
          .body({
            name: faker.name.findName(),
            password: 'St0ngP@ssword!',
            email: faker.internet.email(),
          })
          .path('/register')
          .query(query)
          .build();
        const createUserRes = await createUserController.makeRequest(createUserHttpRequest);
        expect(createUserRes.statusCode).to.equal(201);
        if ('user' in createUserRes.body) {
          expect(createUserRes.body.user).to.have.property('teacherData');
          expect(createUserRes.body).to.have.property('cookies');
        }
      });
    });
  });
});
