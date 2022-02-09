"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const teacher_1 = require("../../../dataAccess/services/teacher");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let getPendingTeachersUsecase;
let fakeDbUserFactory;
let teacherDbService;
let controllerDataBuilder;
let fakeTeacher;
let routeData;
let currentAPIUser;
before(async () => {
    getPendingTeachersUsecase = await _1.makeGetPendingTeachersUsecase;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    teacherDbService = await teacher_1.makeTeacherDbService;
});
beforeEach(async () => {
    const dbServiceAccessOptions = teacherDbService.getBaseDbServiceAccessOptions();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    await teacherDbService.findOneAndUpdate({
        searchQuery: { _id: fakeTeacher.teacherData._id },
        updateQuery: { applicationStatus: 'pending' },
        dbServiceAccessOptions,
    });
    routeData = {
        rawBody: {},
        headers: {},
        params: {},
        body: {},
        query: {},
        endpointPath: '/admin/getPendingTeachers',
    };
    currentAPIUser = {
        userId: fakeTeacher._id,
        role: 'admin',
    };
});
describe('getPendingTeachersUsecase', () => {
    describe('makeRequest', () => {
        const getPendingTeachers = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const getTeachersRes = await getPendingTeachersUsecase.makeRequest(controllerData);
            const pendingTeachers = getTeachersRes.teachers;
            return pendingTeachers;
        };
        const testPendingTeachers = (pendingTeachers) => {
            (0, chai_1.expect)(pendingTeachers.length > 0);
            for (const pendingTeacher of pendingTeachers) {
                (0, chai_1.expect)(pendingTeacher.teacherData.applicationStatus == 'pending');
            }
        };
        const testTeacherError = async () => {
            let error;
            try {
                await getPendingTeachers();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if invalid input is given', async () => {
                    routeData.query = {
                        lessonDurations: ['a', 'b'],
                    };
                    await testTeacherError();
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('as a user', () => {
                        it('should throw an error', async () => {
                            currentAPIUser.role = 'user';
                            await testTeacherError();
                        });
                    });
                    context('as a teacher', () => {
                        it('should throw an error', async () => {
                            currentAPIUser.role = 'teacher';
                            await testTeacherError();
                        });
                    });
                    context('as an unlogged-in user', async () => {
                        it('should get the teachers and return a restricted view', async () => {
                            currentAPIUser = { role: 'user', userId: undefined };
                            await testTeacherError();
                        });
                    });
                });
                context('as an admin', () => {
                    it('should get the teachers and return a less restricted view', async () => {
                        const savedDbTeachers = await getPendingTeachers();
                        testPendingTeachers(savedDbTeachers);
                    });
                });
            });
        });
    });
});
