"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const packageEntity_1 = require("../../../entities/package/packageEntity");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let fakeDbUserFactory;
let fakeUser;
let fakeTeacher;
let currentAPIUser;
let body;
let createPackagesController;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    createPackagesController = await _1.makeCreatePackagesController;
});
beforeEach(async () => {
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    body = {
        packages: [
            {
                lessonAmount: 11,
                isOffering: true,
                type: packageEntity_1.PACKAGE_ENTITY_TYPE.CUSTOM,
                name: 'custom package name',
                lessonDurations: [30],
            },
        ],
    };
    currentAPIUser = {
        userId: fakeTeacher._id,
        teacherId: fakeTeacher.teacherData._id,
        role: fakeTeacher.role,
    };
});
describe('createPackagesController', () => {
    describe('makeRequest', () => {
        const createPackages = async () => {
            const createPackagesHttpRequest = iHttpRequestBuilder
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const createPackages = await createPackagesController.makeRequest(createPackagesHttpRequest);
            return createPackages;
        };
        context('valid inputs', () => {
            it('should create a new package', async () => {
                const createAppointmentsRes = await createPackages();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(201);
                if ('packages' in createAppointmentsRes.body) {
                    (0, chai_1.expect)(createAppointmentsRes.body.packages[0].lessonAmount).to.equal(body.packages[0].lessonAmount);
                }
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                body.packages[0].hostedById = 'some id';
                const createAppointmentsRes = await createPackages();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
            it('should throw an error if the user is not a teacher', async () => {
                currentAPIUser.userId = fakeUser._id;
                currentAPIUser.teacherId = undefined;
                const createAppointmentsRes = await createPackages();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
        });
    });
});
