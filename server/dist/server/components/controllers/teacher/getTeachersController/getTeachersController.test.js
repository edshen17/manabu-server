"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const user_1 = require("../../../dataAccess/services/user");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let fakeDbUserFactory;
let iHttpRequestBuilder;
let getTeachersController;
let queryStringHandler;
let userDbService;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    getTeachersController = await _1.makeGetTeachersController;
    queryStringHandler = queryStringHandler_1.makeQueryStringHandler;
    userDbService = await user_1.makeUserDbService;
});
describe('getTeachersController', () => {
    describe('makeRequest', () => {
        it('should get teachers from the filter', async () => {
            const fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
            const dbServiceAccessOptions = userDbService.getBaseDbServiceAccessOptions();
            await userDbService.findOneAndUpdate({
                searchQuery: { _id: fakeTeacher._id },
                updateQuery: {
                    role: 'teacher',
                    'teacherData.applicationStatus': 'approved',
                    'teacherData.teacherType': 'licensed',
                },
                dbServiceAccessOptions,
            });
            const filter = queryStringHandler.encodeQueryStringObj({
            // teacherType: ['unlicensed', 'licensed'],
            // contactMethodName: ['Skype', 'LINE'],
            // contactMethodType: ['online', 'offline'],
            });
            const query = queryStringHandler.parseQueryString(filter);
            const getTeachersHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: fakeTeacher._id,
                role: fakeTeacher.role,
            })
                .query(query)
                .build();
            const getTeachersRes = await getTeachersController.makeRequest(getTeachersHttpRequest);
            (0, chai_1.expect)(getTeachersRes.statusCode).to.equal(200);
            if ('teachers' in getTeachersRes.body) {
                (0, chai_1.expect)(getTeachersRes.body.teachers.length > 0).to.equal(true);
            }
        });
        it('should not throw an error if no teacher is found', async () => {
            const getTeachersHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: undefined,
                role: 'user',
            })
                .build();
            const getUserRes = await getTeachersController.makeRequest(getTeachersHttpRequest);
            (0, chai_1.expect)(getUserRes.statusCode).to.equal(200);
        });
    });
});
