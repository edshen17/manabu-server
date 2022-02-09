"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbUserFactory;
let editPackageUsecase;
let routeData;
let fakeTeacher;
let currentAPIUser;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    editPackageUsecase = await _1.makeEditPackageUsecase;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
beforeEach(async () => {
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    currentAPIUser = {
        userId: fakeTeacher._id,
        teacherId: fakeTeacher.teacherData._id,
        role: fakeTeacher.role,
    };
    routeData = {
        rawBody: {},
        headers: {},
        params: {
            packageId: fakeTeacher.teacherData.packages[4]._id,
        },
        body: {
            lessonAmount: 10,
        },
        query: {},
        endpointPath: '',
    };
});
describe('editPackageUsecase', () => {
    describe('makeRequest', () => {
        const editPackage = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const editPackagesRes = await editPackageUsecase.makeRequest(controllerData);
            const editedPackage = editPackagesRes.package;
            return editedPackage;
        };
        const testPackageError = async () => {
            let error;
            try {
                await editPackage();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if restricted fields found in body', async () => {
                    const routeDataBody = routeData.body;
                    routeDataBody.hostedById = 'some id';
                    routeDataBody.createdDate = new Date();
                    await testPackageError();
                });
                it('should throw an error if user does not have access', async () => {
                    currentAPIUser.teacherId = undefined;
                    currentAPIUser.userId = undefined;
                    await testPackageError();
                });
                it('should throw an error if editing restricted fields on default package', async () => {
                    routeData.params.packageId = fakeTeacher.teacherData.packages[0]._id;
                    await testPackageError();
                });
            });
            context('valid inputs', () => {
                it('should edit the package', async () => {
                    const updatedPackage = await editPackage();
                    (0, chai_1.expect)(updatedPackage.lessonAmount).to.equal(10);
                });
            });
        });
    });
});
