"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let createAvailableTimeController;
let fakeDbUserFactory;
let fakeTeacher;
let params;
let body;
let currentAPIUser;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    createAvailableTimeController = await _1.makeCreateAvailableTimeController;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
beforeEach(async () => {
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    params = {};
    body = {
        hostedById: fakeTeacher._id,
        startDate: (0, dayjs_1.default)().minute(0).toDate(),
        endDate: (0, dayjs_1.default)().minute(30).toDate(),
    };
    currentAPIUser = {
        role: 'user',
        userId: fakeTeacher._id,
        teacherId: fakeTeacher.teacherData._id,
    };
});
describe('createAvailableTimeController', () => {
    describe('makeRequest', () => {
        const createAvailableTime = async () => {
            const createAvailableTimeHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const createdAvailableTimeRes = await createAvailableTimeController.makeRequest(createAvailableTimeHttpRequest);
            return createdAvailableTimeRes;
        };
        context('valid inputs', () => {
            it('should create a new available time document', async () => {
                const createAvailableTimeRes = await createAvailableTime();
                (0, chai_1.expect)(createAvailableTimeRes.statusCode).to.equal(201);
                if ('availableTime' in createAvailableTimeRes.body) {
                    (0, chai_1.expect)(createAvailableTimeRes.body.availableTime.hostedById).to.deep.equal(fakeTeacher._id);
                }
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                body = {};
                const createAvailableTimeRes = await createAvailableTime();
                (0, chai_1.expect)(createAvailableTimeRes.statusCode).to.equal(409);
            });
            it('should throw an error if the user is not logged in', async () => {
                currentAPIUser.userId = undefined;
                currentAPIUser.teacherId = undefined;
                const createAvailableTimeRes = await createAvailableTime();
                (0, chai_1.expect)(createAvailableTimeRes.statusCode).to.equal(409);
            });
        });
    });
});
