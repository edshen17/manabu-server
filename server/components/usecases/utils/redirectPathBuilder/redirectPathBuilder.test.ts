import { expect } from 'chai';
import { makeRedirectPathBuilder } from '.';
import { RedirectPathBuilder } from './redirectPathBuilder';

let redirectPathBuilder: RedirectPathBuilder;
let defaultQueryStrings: {};
before(() => {
  redirectPathBuilder = makeRedirectPathBuilder;
});

beforeEach(() => {
  defaultQueryStrings = {
    state: 'some state',
    id: 'some id',
  };
});

describe('redirectPathBuilder', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should build an empty redirectPath from no inputs', () => {
        const redirectPath = redirectPathBuilder.build();
        expect(redirectPath).to.equal('');
      });
      context('server redirect', () => {
        context('without query strings', () => {
          it('should redirect to the server', () => {
            const redirectPath = redirectPathBuilder
              .host('server')
              .endpointPath('/users/register')
              .build();
            expect(redirectPath).to.equal('http://localhost:5000/api/users/register');
          });
        });
        context('with query strings', () => {
          it('should redirect to the server', () => {
            const redirectPath = redirectPathBuilder
              .host('server')
              .endpointPath('/users/register')
              .encodeQueryStrings(defaultQueryStrings)
              .build();
            expect(redirectPath).to.equal(
              'http://localhost:5000/api/users/register?id=c29tZSBpZA%3D%3D&state=c29tZSBzdGF0ZQ%3D%3D'
            );
          });
        });
      });
      context('client redirect', () => {
        context('without query strings', () => {
          it('should redirect to the client', () => {
            const redirectPath = redirectPathBuilder
              .host('client')
              .endpointPath('/dashboard')
              .build();
            expect(redirectPath).to.equal('http://localhost:8080/dashboard');
          });
        });
        context('with query strings', () => {
          it('should redirect to the client', () => {
            const redirectPath = redirectPathBuilder
              .host('client')
              .endpointPath('/dashboard')
              .encodeQueryStrings(defaultQueryStrings)
              .build();
            expect(redirectPath).to.equal(
              'http://localhost:8080/dashboard?id=c29tZSBpZA%3D%3D&state=c29tZSBzdGF0ZQ%3D%3D'
            );
          });
        });
      });
    });
  });
});
