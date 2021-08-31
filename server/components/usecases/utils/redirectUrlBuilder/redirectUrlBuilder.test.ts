import { expect } from 'chai';
import { makeRedirectUrlBuilder } from '.';
import { RedirectUrlBuilder } from './redirectUrlBuilder';

let redirectUrlBuilder: RedirectUrlBuilder;
let defaultQueryStrings: {};
before(() => {
  redirectUrlBuilder = makeRedirectUrlBuilder;
});

beforeEach(() => {
  defaultQueryStrings = {
    state: 'some state',
    id: 'some id',
  };
});

describe('redirectUrlBuilder', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should build an empty redirectUrl from no inputs', () => {
        const redirectUrl = redirectUrlBuilder.build();
        expect(redirectUrl).to.equal('');
      });
      context('server redirect', () => {
        context('without query strings', () => {
          it('should redirect to the server', () => {
            const redirectUrl = redirectUrlBuilder
              .host('server')
              .endpoint('/users/register')
              .build();
            expect(redirectUrl).to.equal('http://localhost:5000/api/v1/users/register');
          });
        });
        context('with query strings', () => {
          it('should redirect to the server', () => {
            const redirectUrl = redirectUrlBuilder
              .host('server')
              .endpoint('/users/register')
              .encodeQueryStringObj(defaultQueryStrings)
              .build();
            expect(redirectUrl).to.equal(
              'http://localhost:5000/api/v1/users/register?id=c29tZSBpZA%3D%3D&state=c29tZSBzdGF0ZQ%3D%3D'
            );
          });
        });
      });
      context('client redirect', () => {
        context('without query strings', () => {
          it('should redirect to the client', () => {
            const redirectUrl = redirectUrlBuilder.host('client').endpoint('/dashboard').build();
            expect(redirectUrl).to.equal('http://localhost:8080/dashboard');
          });
        });
        context('with query strings', () => {
          it('should redirect to the client', () => {
            const redirectUrl = redirectUrlBuilder
              .host('client')
              .endpoint('/dashboard')
              .encodeQueryStringObj(defaultQueryStrings)
              .build();
            expect(redirectUrl).to.equal(
              'http://localhost:8080/dashboard?id=c29tZSBpZA%3D%3D&state=c29tZSBzdGF0ZQ%3D%3D'
            );
          });
        });
      });
    });
  });
});
