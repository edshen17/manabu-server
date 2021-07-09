import faker from 'faker';
import { expect } from 'chai';
import { makeCreateUserController } from '.';
import { makeIHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder/IHttpRequestBuilder';
import { CreateUserController } from './createUserController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let createUserController: CreateUserController;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  createUserController = await makeCreateUserController;
});

describe('createUserController', () => {
  describe('makeRequest', () => {
    it('should create a new user and return a user as well as cookies to set', async () => {
      const createUserHttpRequest = iHttpRequestBuilder
        .body({
          name: faker.name.findName(),
          password: 'St0ngP@ssword!',
          email: faker.internet.email(),
        })
        .path('/register')
        .build();
      const createUserRes = await createUserController.makeRequest(createUserHttpRequest);
      expect(createUserRes.statusCode).to.equal(201);
      if ('token' in createUserRes.body) {
        expect(createUserRes.body).to.have.property('user');
        expect(createUserRes.body).to.have.property('cookies');
      }
    });
  });
});
