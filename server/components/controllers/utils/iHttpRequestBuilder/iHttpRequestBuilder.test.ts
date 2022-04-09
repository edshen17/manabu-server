import { expect } from 'chai';
import { makeIHttpRequestBuilder } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { IHttpRequestBuilder } from './iHttpRequestBuilder';

let iHttpRequestBuilder: IHttpRequestBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeUser: JoinedUserDoc;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
});

describe('IHttpRequestBuilder', () => {
  describe('build', () => {
    it('should build an empty httpRequest from no inputs', () => {
      const httpRequest = iHttpRequestBuilder.build();
      expect(httpRequest).to.deep.equal({
        body: {},
        path: '',
        query: {},
        params: {},
        currentAPIUser: {
          userId: undefined,
          role: 'user',
        },
        headers: {},
        rawBody: {},
        cookies: {},
      });
    });
    it('should build a valid httpRequest from the given inputs', () => {
      const httpRequest = iHttpRequestBuilder
        .body({
          name: 'some name',
        })
        .path('/somePath')
        .query({})
        .params({})
        .currentAPIUser({
          userId: fakeUser._id,
          role: 'some role',
        })
        .cookies({})
        .build();

      expect(httpRequest).to.deep.equal({
        body: {
          name: 'some name',
        },
        path: '/somePath',
        query: {},
        params: {},
        currentAPIUser: {
          userId: fakeUser._id,
          role: 'some role',
        },
        headers: {},
        rawBody: {},
        cookies: {},
      });
    });
  });
});
