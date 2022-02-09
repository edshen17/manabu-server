"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let fakeDbUserFactory;
let iHttpRequestBuilder;
let getUserController;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    getUserController = await _1.makeGetUserController;
});
describe('getUserController', () => {
    describe('makeRequest', () => {
        it('should get a fake user with correct properties (self)', async () => {
            const fakeUser = await fakeDbUserFactory.createFakeDbUser();
            const getUserHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: fakeUser._id,
                role: fakeUser.role,
            })
                .params({
                userId: fakeUser._id,
            })
                .path('/self')
                .build();
            const getUserRes = await getUserController.makeRequest(getUserHttpRequest);
            (0, chai_1.expect)(getUserRes.statusCode).to.equal(200);
            if ('user' in getUserRes.body) {
                (0, chai_1.expect)(getUserRes.body.user).to.have.property('settings');
                (0, chai_1.expect)(getUserRes.body.user).to.have.property('email');
            }
        });
        it('should get a fake user with correct properties (not self)', async () => {
            const fakeUser = await fakeDbUserFactory.createFakeDbUser();
            const fakeOtherUser = await fakeDbUserFactory.createFakeDbUser();
            const getUserHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: fakeUser._id,
                role: fakeUser.role,
            })
                .params({
                userId: fakeOtherUser._id,
            })
                .build();
            const getUserRes = await getUserController.makeRequest(getUserHttpRequest);
            (0, chai_1.expect)(getUserRes.statusCode).to.equal(200);
            if ('user' in getUserRes.body) {
                (0, chai_1.expect)(getUserRes.body.user).to.not.have.property('settings');
                (0, chai_1.expect)(getUserRes.body.user).to.not.have.property('email');
            }
        });
        it('should throw an error if no user is found', async () => {
            const getUserHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: undefined,
                role: 'user',
            })
                .params({
                userId: undefined,
            })
                .build();
            const getUserRes = await getUserController.makeRequest(getUserHttpRequest);
            (0, chai_1.expect)(getUserRes.statusCode).to.equal(404);
        });
    });
});
