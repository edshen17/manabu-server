"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let deletePackageController;
let fakeDbUserFactory;
let fakeTeacher;
let fakeUser;
let body;
let currentAPIUser;
let params;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    deletePackageController = await _1.makeDeletePackageController;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
beforeEach(async () => {
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    params = {
        packageId: fakeTeacher.teacherData.packages[4]._id,
    };
    body = {};
    currentAPIUser = {
        role: fakeTeacher.role,
        userId: fakeTeacher._id,
        teacherId: fakeTeacher.teacherData._id,
    };
});
describe('deletePackageController', () => {
    describe('makeRequest', () => {
        const deletePackage = async () => {
            const deletePackageHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const deletePackageRes = await deletePackageController.makeRequest(deletePackageHttpRequest);
            return deletePackageRes;
        };
        context('valid inputs', () => {
            it('should delete the package', async () => {
                const deletePackageRes = await deletePackage();
                (0, chai_1.expect)(deletePackageRes.statusCode).to.equal(200);
            });
            it('should throw error if deleting default package', async () => {
                params.packageId = fakeTeacher.teacherData.packages[0]._id;
                const deletePackageRes = await deletePackage();
                (0, chai_1.expect)(deletePackageRes.statusCode).to.equal(500);
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                params = {};
                const deletePackageRes = await deletePackage();
                (0, chai_1.expect)(deletePackageRes.statusCode).to.equal(500);
            });
            it('should throw an error if user does not have access to the resource', async () => {
                currentAPIUser.userId = fakeUser._id;
                const deletePackageRes = await deletePackage();
                (0, chai_1.expect)(deletePackageRes.statusCode).to.equal(500);
            });
            it('should throw an error if the user is not logged in', async () => {
                currentAPIUser.userId = undefined;
                const deletePackageRes = await deletePackage();
                (0, chai_1.expect)(deletePackageRes.statusCode).to.equal(500);
            });
        });
    });
});
