import { expect } from 'chai';
import { makeIHttpRequestBuilder } from '.';
import { IHttpRequestBuilder } from './IHttpRequestBuilder';

let iHttpRequestBuilder: IHttpRequestBuilder;

before(() => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
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
          userId: 'some userId',
          role: 'some role',
        })
        .build();

      expect(httpRequest).to.deep.equal({
        body: {
          name: 'some name',
        },
        path: '/somePath',
        query: {},
        params: {},
        currentAPIUser: {
          userId: 'some userId',
          role: 'some role',
        },
      });
    });
  });
});
