"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const packageEntity_1 = require("../../../entities/package/packageEntity");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbUserFactory;
let createPackagesUsecase;
let routeData;
let fakeTeacher;
let currentAPIUser;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createPackagesUsecase = await _1.makeCreatePackagesUsecase;
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
        params: {},
        body: {
            packages: [
                {
                    lessonAmount: 6,
                    type: packageEntity_1.PACKAGE_ENTITY_TYPE.CUSTOM,
                    name: 'some package name',
                    isOffering: true,
                    lessonDurations: [30, 60],
                },
            ],
        },
        query: {},
        endpointPath: '',
    };
});
describe('createPackageUsecase', () => {
    describe('makeRequest', () => {
        const createPackages = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const createPackagesRes = await createPackagesUsecase.makeRequest(controllerData);
            const packages = createPackagesRes.packages;
            return packages;
        };
        const testPackagesError = async () => {
            let error;
            try {
                await createPackages();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if restricted fields found in body', async () => {
                    routeData.body = {};
                    await testPackagesError();
                });
                it('should throw an error if user does not have access', async () => {
                    currentAPIUser.teacherId = undefined;
                    await testPackagesError();
                });
            });
            context('valid inputs', () => {
                it('should create new packages', async () => {
                    const packages = await createPackages();
                    (0, chai_1.expect)(packages[0].lessonAmount).to.equal(routeData.body.packages[0].lessonAmount);
                });
            });
        });
    });
});
