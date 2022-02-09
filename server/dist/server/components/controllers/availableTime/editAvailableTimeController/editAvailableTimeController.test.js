"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let editAvailableTimeController;
let fakeDbAvailableTimeFactory;
let fakeAvailableTime;
let body;
let currentAPIUser;
let params;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    editAvailableTimeController = await _1.makeEditAvailableTimeController;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
});
beforeEach(async () => {
    params = {
        availableTimeId: fakeAvailableTime._id,
    };
    body = {
        startDate: (0, dayjs_1.default)().minute(0).toDate(),
        endDate: (0, dayjs_1.default)().minute(30).toDate(),
    };
    currentAPIUser = {
        role: 'user',
        userId: fakeAvailableTime.hostedById,
    };
});
describe('editAvailableTimeController', () => {
    describe('makeRequest', () => {
        const editAvailableTime = async () => {
            const editAvailableTimeHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const editAvailableTimeRes = await editAvailableTimeController.makeRequest(editAvailableTimeHttpRequest);
            return editAvailableTimeRes;
        };
        context('valid inputs', () => {
            it('should edit the availableTime document', async () => {
                const editAvailableTimeRes = await editAvailableTime();
                (0, chai_1.expect)(editAvailableTimeRes.statusCode).to.equal(200);
                if ('availableTime' in editAvailableTimeRes.body) {
                    (0, chai_1.expect)(editAvailableTimeRes.body.availableTime).to.not.deep.equal(fakeAvailableTime);
                }
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                params = {};
                const editAvailableTimeRes = await editAvailableTime();
                (0, chai_1.expect)(editAvailableTimeRes.statusCode).to.equal(401);
            });
            it('should throw an error if user does not have access to the resource', async () => {
                params = {
                    availableTimeId: '507f191e810c19729de860ea',
                };
                const editAvailableTimeRes = await editAvailableTime();
                (0, chai_1.expect)(editAvailableTimeRes.statusCode).to.equal(401);
            });
            it('should throw an error if the user is not logged in', async () => {
                currentAPIUser.userId = undefined;
                const editAvailableTimeRes = await editAvailableTime();
                (0, chai_1.expect)(editAvailableTimeRes.statusCode).to.equal(401);
            });
        });
    });
});
