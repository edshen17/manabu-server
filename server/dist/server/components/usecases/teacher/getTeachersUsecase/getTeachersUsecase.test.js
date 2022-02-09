"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const teacher_1 = require("../../../dataAccess/services/teacher");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let getTeachersUsecase;
let fakeDbUserFactory;
let controllerDataBuilder;
let fakeUser;
let fakeTeacher;
let routeData;
let currentAPIUser;
let teacherDbService;
before(async () => {
    getTeachersUsecase = await _1.makeGetTeachersUsecase;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    teacherDbService = await teacher_1.makeTeacherDbService;
});
beforeEach(async () => {
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    const dbServiceAccessOptions = teacherDbService.getBaseDbServiceAccessOptions();
    await teacherDbService.findOneAndUpdate({
        searchQuery: { _id: fakeTeacher.teacherData._id },
        updateQuery: {
            applicationStatus: 'approved',
            teacherType: 'licensed',
        },
        dbServiceAccessOptions,
    });
    routeData = {
        rawBody: {},
        headers: {},
        params: {},
        body: {},
        query: {
        // teachingLanguages: ['ja'],
        // alsoSpeaks: ['en'],
        // teacherType: ['unlicensed', 'licensed'],
        // minPrice: 30,
        // maxPrice: 40,
        // teacherTags: [],
        // packageTags: [],
        // lessonDurations: [30, 60, 90, 120],
        // contactMethodName: ['Skype', 'LINE'],
        // contactMethodType: ['online', 'offline'],
        },
        endpointPath: '',
    };
    currentAPIUser = {
        userId: fakeTeacher._id,
        role: fakeTeacher.role,
    };
});
describe('getTeachersUsecase', () => {
    describe('makeRequest', () => {
        const getTeachers = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const getTeachersRes = await getTeachersUsecase.makeRequest(controllerData);
            const savedDbTeachers = getTeachersRes.teachers;
            return savedDbTeachers;
        };
        const testTeachersViews = (savedDbTeachers) => {
            for (const teacher of savedDbTeachers) {
                (0, chai_1.expect)(teacher).to.not.have.property('email');
                (0, chai_1.expect)(teacher).to.not.have.property('settings');
                (0, chai_1.expect)(teacher).to.not.have.property('contactMethods');
                (0, chai_1.expect)(teacher.teacherData).to.not.have.property('licenseUrl');
                (0, chai_1.expect)(teacher).to.not.have.property('password');
                (0, chai_1.expect)(teacher).to.not.have.property('verificationToken');
            }
        };
        const testTeacherError = async () => {
            let error;
            try {
                await getTeachers();
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
                    context('viewing self', () => {
                        it('should get the teachers and return a less restricted view', async () => {
                            const savedDbTeachers = await getTeachers();
                            testTeachersViews(savedDbTeachers);
                        });
                    });
                    context('viewing other', () => {
                        it('should get the teachers and return a restricted view', async () => {
                            currentAPIUser.userId = fakeUser._id;
                            const savedDbTeachers = await getTeachers();
                            testTeachersViews(savedDbTeachers);
                        });
                    });
                });
                context('as an admin', () => {
                    context('viewing other', () => {
                        it('should get the teachers and return a less restricted view', async () => {
                            currentAPIUser.userId = fakeTeacher._id;
                            currentAPIUser.role = 'admin';
                            const savedDbTeachers = await getTeachers();
                            testTeachersViews(savedDbTeachers);
                        });
                    });
                });
                context('as an unlogged-in user', async () => {
                    it('should get the teachers and return a restricted view', async () => {
                        currentAPIUser = { role: 'user', userId: undefined };
                        const savedDbTeachers = await getTeachers();
                        testTeachersViews(savedDbTeachers);
                    });
                });
            });
        });
    });
});
