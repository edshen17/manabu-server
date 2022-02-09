"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let fakeDbUserFactory;
let iHttpRequestBuilder;
let editUserController;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    editUserController = await _1.makeEditUserController;
});
describe('editUserController', () => {
    describe('makeRequest', () => {
        it('should update the user', async () => {
            const fakeUser = await fakeDbUserFactory.createFakeDbUser();
            const editUserHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: fakeUser._id,
                role: fakeUser.role,
            })
                .body({ name: 'new name' })
                .params({
                userId: fakeUser._id,
            })
                .build();
            const updateUserRes = await editUserController.makeRequest(editUserHttpRequest);
            (0, chai_1.expect)(updateUserRes.statusCode).to.equal(200);
            if ('user' in updateUserRes.body) {
                (0, chai_1.expect)(updateUserRes.body.user.name).to.equal('new name');
            }
        });
        it('should throw an error when access denied (editing another user)', async () => {
            const fakeUpdater = await fakeDbUserFactory.createFakeDbUser();
            const fakeUpdatee = await fakeDbUserFactory.createFakeDbUser();
            const editUserHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: fakeUpdater._id,
                role: fakeUpdater.role,
            })
                .body({ name: 'new name' })
                .params({
                userId: fakeUpdatee._id,
            })
                .build();
            const updateUserRes = await editUserController.makeRequest(editUserHttpRequest);
            (0, chai_1.expect)(updateUserRes.statusCode).to.equal(401);
        });
        it("should edit the user, even if it's another user (editing as admin)", async () => {
            const fakeUpdater = await fakeDbUserFactory.createFakeDbUser();
            const fakeUpdatee = await fakeDbUserFactory.createFakeDbUser();
            const editUserHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: fakeUpdater._id,
                role: 'admin',
            })
                .body({ name: 'new name' })
                .params({
                userId: fakeUpdatee._id,
            })
                .build();
            const updateUserRes = await editUserController.makeRequest(editUserHttpRequest);
            (0, chai_1.expect)(updateUserRes.statusCode).to.equal(200);
            if ('user' in updateUserRes.body) {
                (0, chai_1.expect)(updateUserRes.body.user.name).to.equal('new name');
            }
        });
    });
});
