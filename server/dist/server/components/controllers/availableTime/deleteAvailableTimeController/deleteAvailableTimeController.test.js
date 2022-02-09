"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let deleteAvailableTimeController;
let fakeDbAvailableTimeFactory;
let fakeAvailableTime;
let body;
let currentAPIUser;
let params;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    deleteAvailableTimeController = await _1.makeDeleteAvailableTimeController;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
});
beforeEach(async () => {
    params = {
        availableTimeId: fakeAvailableTime._id,
    };
    body = {};
    currentAPIUser = {
        role: 'user',
        userId: fakeAvailableTime.hostedById,
    };
});
describe('deleteAvailableTimeController', () => {
    describe('makeRequest', () => {
        const deleteAvailableTime = async () => {
            const deleteAvailableTimeHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const deletedAvailableTimeRes = await deleteAvailableTimeController.makeRequest(deleteAvailableTimeHttpRequest);
            return deletedAvailableTimeRes;
        };
        context('valid inputs', () => {
            it('should delete the available time document', async () => {
                const deleteAvailableTimeRes = await deleteAvailableTime();
                (0, chai_1.expect)(deleteAvailableTimeRes.statusCode).to.equal(200);
                if ('availableTime' in deleteAvailableTimeRes.body) {
                    (0, chai_1.expect)(deleteAvailableTimeRes.body.availableTime).to.deep.equal(fakeAvailableTime);
                }
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                params = {};
                const deleteAvailableTimeRes = await deleteAvailableTime();
                (0, chai_1.expect)(deleteAvailableTimeRes.statusCode).to.equal(500);
            });
            it('should throw an error if user does not have access to the resource', async () => {
                params = {
                    availableTimeId: '507f191e810c19729de860ea',
                };
                const deleteAvailableTimeRes = await deleteAvailableTime();
                (0, chai_1.expect)(deleteAvailableTimeRes.statusCode).to.equal(500);
            });
            it('should throw an error if the user is not logged in', async () => {
                currentAPIUser.userId = undefined;
                const deleteAvailableTimeRes = await deleteAvailableTime();
                (0, chai_1.expect)(deleteAvailableTimeRes.statusCode).to.equal(500);
            });
        });
    });
});
