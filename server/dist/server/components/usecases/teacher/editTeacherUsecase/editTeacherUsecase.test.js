"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let fakeDbUserFactory;
let controllerDataBuilder;
let fakeTeacher;
let editTeacherUsecase;
let routeData;
let currentAPIUser;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    editTeacherUsecase = await _1.makeEditTeacherUsecase;
});
beforeEach(() => {
    currentAPIUser = {
        userId: fakeTeacher._id,
        teacherId: fakeTeacher.teacherData._id,
        role: fakeTeacher.role,
    };
    routeData = {
        rawBody: {},
        headers: {},
        body: {
            licenseUrl: 'https://fakeimg.pl/300/',
        },
        params: {
            teacherId: fakeTeacher.teacherData._id,
        },
        query: {},
        endpointPath: '',
    };
});
describe('editTeacherUsecase', () => {
    describe('makeRequest', async () => {
        const editTeacher = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const editTeacherRes = await editTeacherUsecase.makeRequest(controllerData);
            const editedTeacher = editTeacherRes.user;
            return editedTeacher;
        };
        const testTeacherError = async () => {
            let error;
            try {
                await editTeacher();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        describe('editing teacher data', () => {
            it('should update the teacher in the db and return the correct properties (self)', async () => {
                const editedTeacher = await editTeacher();
                (0, chai_1.expect)(editedTeacher.teacherData.licenseUrl).to.equal('https://fakeimg.pl/300/');
            });
            it('should deny access when updating restricted properties (self)', async () => {
                routeData.body = {
                    createdDate: new Date(),
                };
                await testTeacherError();
            });
            it('should deny access when trying to update restricted properties (not self)', async () => {
                const otherFakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
                routeData.params.teacherId = otherFakeTeacher.teacherData._id;
                await testTeacherError();
            });
            it('should deny access with not logged in', async () => {
                currentAPIUser.userId = undefined;
                currentAPIUser.teacherId = undefined;
                await testTeacherError();
            });
        });
    });
});
