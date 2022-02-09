"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
const index_1 = require("./index");
let getUserUsecase;
let fakeDbUserFactory;
let controllerDataBuilder;
let fakeUser;
let fakeTeacher;
let routeData;
let currentAPIUser;
before(async () => {
    getUserUsecase = await index_1.makeGetUserUsecase;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
});
beforeEach(async () => {
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    routeData = {
        rawBody: {},
        headers: {},
        params: {
            userId: fakeTeacher._id,
        },
        body: {},
        query: {},
        endpointPath: '',
    };
    currentAPIUser = {
        userId: fakeTeacher._id,
        teacherId: fakeTeacher.teacherData._id,
        role: fakeTeacher.role,
    };
});
describe('getUserUsecase', () => {
    describe('makeRequest', () => {
        const getUser = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const getUserRes = await getUserUsecase.makeRequest(controllerData);
            const savedDbUser = getUserRes.user;
            return savedDbUser;
        };
        const testUserViews = (savedDbUser, viewingAsRole) => {
            if (viewingAsRole == 'admin' || viewingAsRole == 'self') {
                (0, chai_1.expect)(savedDbUser).to.have.property('email');
                (0, chai_1.expect)(savedDbUser).to.have.property('settings');
                (0, chai_1.expect)(savedDbUser).to.have.property('contactMethods');
                (0, chai_1.expect)(savedDbUser.teacherData).to.have.property('licenseUrl');
                (0, chai_1.expect)(savedDbUser).to.not.have.property('password');
                (0, chai_1.expect)(savedDbUser).to.not.have.property('verificationToken');
            }
            else {
                (0, chai_1.expect)(savedDbUser).to.not.have.property('email');
                (0, chai_1.expect)(savedDbUser).to.not.have.property('settings');
                (0, chai_1.expect)(savedDbUser).to.not.have.property('contactMethods');
                (0, chai_1.expect)(savedDbUser.teacherData).to.not.have.property('licenseUrl');
                (0, chai_1.expect)(savedDbUser).to.not.have.property('password');
                (0, chai_1.expect)(savedDbUser).to.not.have.property('verificationToken');
            }
        };
        const testUserError = async () => {
            let error;
            try {
                await getUser();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if no user is found', async () => {
                    routeData.params = {};
                    await testUserError();
                });
                it('should throw an error if an invalid id is given', async () => {
                    routeData.params = { _id: 'undefined' };
                    await testUserError();
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it('should get the user and return a less restricted view', async () => {
                            const savedDbUser = await getUser();
                            testUserViews(savedDbUser, 'self');
                        });
                        it('should get the user and return a less restricted view on the self endpoint', async () => {
                            routeData.endpointPath = '/self';
                            routeData.params = {};
                            const savedDbUser = await getUser();
                            testUserViews(savedDbUser, 'self');
                        });
                    });
                    context('viewing other', () => {
                        it('should get the user and return a restricted view', async () => {
                            currentAPIUser.userId = fakeUser._id;
                            const savedDbUser = await getUser();
                            testUserViews(savedDbUser, savedDbUser.role);
                        });
                    });
                });
                context('as an admin', () => {
                    context('viewing other', () => {
                        it('should get the user and return a less restricted view', async () => {
                            currentAPIUser.userId = fakeTeacher._id;
                            currentAPIUser.role = 'admin';
                            const savedDbUser = await getUser();
                            testUserViews(savedDbUser, currentAPIUser.role);
                        });
                    });
                });
                context('as an unlogged-in user', async () => {
                    it('should get the user and return a restricted view', async () => {
                        currentAPIUser = { role: 'user', userId: undefined };
                        const savedDbUser = await getUser();
                        testUserViews(savedDbUser, currentAPIUser.role);
                    });
                });
            });
        });
    });
});
