"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbUserFactory;
let deletePackageUsecase;
let routeData;
let fakeTeacher;
let currentAPIUser;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    deletePackageUsecase = await _1.makeDeletePackageUsecase;
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
        body: {},
        query: {},
        endpointPath: '',
    };
});
describe('deletePackageUsecase', () => {
    describe('makeRequest', () => {
        const deletePackage = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const deletePackagesRes = await deletePackageUsecase.makeRequest(controllerData);
            const deletedPackage = deletePackagesRes.package;
            return deletedPackage;
        };
        const testPackageError = async () => {
            let error;
            try {
                await deletePackage();
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
                    currentAPIUser.userId = undefined;
                    currentAPIUser.teacherId = undefined;
                    await testPackageError();
                });
            });
            context('valid inputs', () => {
                it('should delete the package', async () => {
                    const updatedPackages = await deletePackage();
                    (0, chai_1.expect)(updatedPackages).to.not.equal(undefined);
                });
                it('should not delete the package if it is a default package', async () => {
                    routeData.params.packageId = fakeTeacher.teacherData.packages[0]._id;
                    await testPackageError();
                });
            });
        });
    });
});
