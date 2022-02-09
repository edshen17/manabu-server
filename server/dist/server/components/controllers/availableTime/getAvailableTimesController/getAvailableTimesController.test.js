"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let getAvailableTimesController;
let fakeDbAvailableTimeFactory;
let fakeAvailableTime;
let body;
let currentAPIUser;
let params;
let path;
let query;
let queryStringHandler;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    getAvailableTimesController = await _1.makeGetAvailableTimesController;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
    queryStringHandler = queryStringHandler_1.makeQueryStringHandler;
});
beforeEach(async () => {
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
    params = {};
    body = {};
    currentAPIUser = {
        role: 'user',
        userId: fakeAvailableTime.hostedById,
    };
    path = '';
    const filter = queryStringHandler.encodeQueryStringObj({
        endDate: (0, dayjs_1.default)().add(1, 'hour').toDate(),
    });
    query = queryStringHandler.parseQueryString(filter);
});
describe('getAvailableTimesController', () => {
    describe('makeRequest', () => {
        const getAvailableTimes = async () => {
            const getAvailableTimesHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .path(path)
                .query(query)
                .build();
            const getAvailableTimesRes = await getAvailableTimesController.makeRequest(getAvailableTimesHttpRequest);
            return getAvailableTimesRes;
        };
        const testValidGetAvailableTimes = async () => {
            const getAvailableTimesRes = await getAvailableTimes();
            (0, chai_1.expect)(getAvailableTimesRes.statusCode).to.equal(200);
        };
        const testInvalidGetAvailableTimes = async () => {
            const getAvailableTimesRes = await getAvailableTimes();
            (0, chai_1.expect)(getAvailableTimesRes.statusCode).to.equal(404);
        };
        context('valid inputs', () => {
            context('as a non-admin user', () => {
                context('viewing self', () => {
                    it('should get the available times for the user', async () => {
                        params = {};
                        path = '/self';
                        await testValidGetAvailableTimes();
                    });
                });
                context('viewing other', () => {
                    it('should get the availableTimes', async () => {
                        currentAPIUser.userId = undefined;
                        await testValidGetAvailableTimes();
                    });
                });
            });
            context('as an admin', () => {
                it('should get the availableTimes', async () => {
                    currentAPIUser.role = 'admin';
                    await testValidGetAvailableTimes();
                });
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                params = {
                    availableTimeId: 'some id',
                };
                await testInvalidGetAvailableTimes();
            });
        });
    });
});
