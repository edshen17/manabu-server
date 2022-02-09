"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
let iHttpRequestBuilder;
let fakeDbUserFactory;
let fakeUser;
before(async () => {
    iHttpRequestBuilder = _1.makeIHttpRequestBuilder;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
});
describe('IHttpRequestBuilder', () => {
    describe('build', () => {
        it('should build an empty httpRequest from no inputs', () => {
            const httpRequest = iHttpRequestBuilder.build();
            (0, chai_1.expect)(httpRequest).to.deep.equal({
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
                .build();
            (0, chai_1.expect)(httpRequest).to.deep.equal({
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
            });
        });
    });
});
