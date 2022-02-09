"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let editPackageController;
let fakeDbUserFactory;
let fakeTeacher;
let fakeUser;
let body;
let currentAPIUser;
let params;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    editPackageController = await _1.makeEditPackageController;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
beforeEach(async () => {
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    params = {
        packageId: fakeTeacher.teacherData.packages[0]._id,
    };
    body = {
        lessonDurations: [90],
    };
    currentAPIUser = {
        role: fakeTeacher.role,
        userId: fakeTeacher._id,
        teacherId: fakeTeacher.teacherData._id,
    };
});
describe('editPackageController', () => {
    describe('makeRequest', () => {
        const editPackage = async () => {
            const editPackageHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const editPackageRes = await editPackageController.makeRequest(editPackageHttpRequest);
            return editPackageRes;
        };
        context('valid inputs', () => {
            it('should edit the package', async () => {
                const editPackageRes = await editPackage();
                (0, chai_1.expect)(editPackageRes.statusCode).to.equal(200);
                if ('package' in editPackageRes.body) {
                    (0, chai_1.expect)(editPackageRes.body.package.lessonDurations).to.deep.equal([90]);
                }
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                body = {
                    lessonDurations: [4312],
                };
                const editPackageRes = await editPackage();
                (0, chai_1.expect)(editPackageRes.statusCode).to.equal(401);
            });
            it('should throw an error if user does not have access to the resource', async () => {
                currentAPIUser.userId = fakeUser._id;
                const editPackageRes = await editPackage();
                (0, chai_1.expect)(editPackageRes.statusCode).to.equal(401);
            });
            it('should throw an error if the user is not logged in', async () => {
                currentAPIUser.userId = undefined;
                const editPackageRes = await editPackage();
                (0, chai_1.expect)(editPackageRes.statusCode).to.equal(401);
            });
        });
    });
});
