"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let redirectUrlBuilder;
let defaultQueryStrings;
before(() => {
    redirectUrlBuilder = _1.makeRedirectUrlBuilder;
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
                (0, chai_1.expect)(redirectUrl).to.equal('');
            });
            context('server redirect', () => {
                context('without query strings', () => {
                    it('should redirect to the server', () => {
                        const redirectUrl = redirectUrlBuilder
                            .host('server')
                            .endpoint('/users/register')
                            .build();
                        (0, chai_1.expect)(redirectUrl).to.equal('http://localhost:5000/api/v1/users/register');
                    });
                });
                context('with query strings', () => {
                    it('should redirect to the server', () => {
                        const redirectUrl = redirectUrlBuilder
                            .host('server')
                            .endpoint('/users/register')
                            .encodeQueryStringObj(defaultQueryStrings)
                            .build();
                        (0, chai_1.expect)(redirectUrl).to.equal('http://localhost:5000/api/v1/users/register?id=c29tZSBpZA%3D%3D&state=c29tZSBzdGF0ZQ%3D%3D');
                    });
                });
            });
            context('client redirect', () => {
                context('without query strings', () => {
                    it('should redirect to the client', () => {
                        const redirectUrl = redirectUrlBuilder.host('client').endpoint('/dashboard').build();
                        (0, chai_1.expect)(redirectUrl).to.equal('http://localhost:8080/dashboard');
                    });
                });
                context('with query strings', () => {
                    it('should redirect to the client', () => {
                        const redirectUrl = redirectUrlBuilder
                            .host('client')
                            .endpoint('/dashboard')
                            .encodeQueryStringObj(defaultQueryStrings)
                            .build();
                        (0, chai_1.expect)(redirectUrl).to.equal('http://localhost:8080/dashboard?id=c29tZSBpZA%3D%3D&state=c29tZSBzdGF0ZQ%3D%3D');
                    });
                });
            });
        });
    });
});
