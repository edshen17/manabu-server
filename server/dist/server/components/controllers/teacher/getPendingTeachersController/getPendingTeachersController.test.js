"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const teacher_1 = require("../../../dataAccess/services/teacher");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let getPendingTeachersController;
let teacherDbService;
let iHttpRequestBuilder;
let fakeDbUserFactory;
let fakeTeacher;
let body;
let currentAPIUser;
let params;
let path;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    getPendingTeachersController = await _1.makeGetPendingTeachersController;
    teacherDbService = await teacher_1.makeTeacherDbService;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
beforeEach(async () => {
    const dbServiceAccessOptions = teacherDbService.getBaseDbServiceAccessOptions();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    await teacherDbService.findOneAndUpdate({
        searchQuery: { _id: fakeTeacher.teacherData._id },
        updateQuery: { applicationStatus: 'pending' },
        dbServiceAccessOptions,
    });
    params = {};
    body = {};
    currentAPIUser = {
        role: 'admin',
        userId: fakeTeacher._id,
    };
    path = 'admin/pendingTeachers';
});
describe('getPendingTeachersController', () => {
    describe('makeRequest', () => {
        const getPendingTeachers = async () => {
            const getPendingTeachersHttpReq = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .path(path)
                .build();
            const getUserTeacherEdgesHttpRes = await getPendingTeachersController.makeRequest(getPendingTeachersHttpReq);
            return getUserTeacherEdgesHttpRes;
        };
        const testValidGetPendingTeachers = async () => {
            const getPendingTeachersRes = await getPendingTeachers();
            (0, chai_1.expect)(getPendingTeachersRes.statusCode).to.equal(200);
            if ('teachers' in getPendingTeachersRes.body) {
                (0, chai_1.expect)(getPendingTeachersRes.body.teachers.length > 0).to.equal(true);
            }
        };
        const testInvalidGetPendingTeachers = async () => {
            const getPendingTeachersRes = await getPendingTeachers();
            (0, chai_1.expect)(getPendingTeachersRes.statusCode).to.equal(404);
        };
        context('valid inputs', () => {
            context('as a non-admin user', () => {
                context('as a user', () => {
                    it('should throw an error', async () => {
                        currentAPIUser.role = 'user';
                        await testInvalidGetPendingTeachers();
                    });
                });
                context('as a teacher', () => {
                    it('should throw an error', async () => {
                        currentAPIUser.role = 'teacher';
                        await testInvalidGetPendingTeachers();
                    });
                });
                context('as an unlogged-in user', async () => {
                    it('should get the teachers and return a restricted view', async () => {
                        currentAPIUser = { role: 'user', userId: undefined };
                        await testInvalidGetPendingTeachers();
                    });
                });
            });
            context('as an admin', () => {
                it('should get the pending teachers', async () => {
                    await testValidGetPendingTeachers();
                });
            });
            context('as an unlogged-in user', async () => {
                it('should throw an error', async () => {
                    currentAPIUser = { role: 'user', userId: undefined };
                    await testInvalidGetPendingTeachers();
                });
            });
        });
        context('invalid inputs', () => {
            it('should throw an error', async () => {
                params = { _id: 'some bad id' };
                await testInvalidGetPendingTeachers();
            });
        });
    });
});
