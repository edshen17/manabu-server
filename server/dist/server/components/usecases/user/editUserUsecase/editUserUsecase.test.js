"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let fakeDbUserFactory;
let controllerDataBuilder;
let editUserUsecase;
let routeData;
let currentAPIUser;
let fakeTeacher;
before(async () => {
    editUserUsecase = await _1.makeEditUserUsecase;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
});
beforeEach(() => {
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
        role: fakeTeacher.role,
    };
});
describe('editUserUsecase', () => {
    describe('makeRequest', () => {
        const editUser = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const updateUserRes = await editUserUsecase.makeRequest(controllerData);
            const updatedUser = updateUserRes.user;
            return updatedUser;
        };
        const testUserViews = (savedDbUser) => {
            (0, chai_1.expect)(savedDbUser).to.have.property('email');
            (0, chai_1.expect)(savedDbUser).to.have.property('settings');
            (0, chai_1.expect)(savedDbUser).to.have.property('contactMethods');
            (0, chai_1.expect)(savedDbUser.teacherData).to.have.property('licenseUrl');
            (0, chai_1.expect)(savedDbUser).to.not.have.property('password');
            (0, chai_1.expect)(savedDbUser).to.not.have.property('verificationToken');
        };
        const testUserError = async () => {
            let error;
            try {
                await editUser();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if restricted fields found in body', async () => {
                    routeData.body = {
                        _id: 'some id',
                        role: 'admin',
                        dateRegistered: new Date(),
                        verificationToken: 'new token',
                    };
                    await testUserError();
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('updating self', () => {
                        it('should update the user and return a restricted view', async () => {
                            (0, chai_1.expect)(fakeTeacher.profileBio).to.equal('');
                            routeData.body = {
                                profileBio: 'new profile bio',
                            };
                            const updatedUser = await editUser();
                            (0, chai_1.expect)(updatedUser.profileBio).to.equal('new profile bio');
                            testUserViews(updatedUser);
                        });
                    });
                });
                context('as an admin', () => {
                    context('updating other', () => {
                        it('should update the user and return a less restricted view', async () => {
                            const updaterUser = fakeTeacher;
                            const updateeUser = await fakeDbUserFactory.createFakeDbTeacher();
                            const { body, params } = routeData;
                            (0, chai_1.expect)(updateeUser.profileBio).to.equal('');
                            body.profileBio = 'new profile bio';
                            params.userId = updateeUser._id;
                            currentAPIUser.userId = updaterUser._id;
                            currentAPIUser.role = 'admin';
                            const updatedUser = await editUser();
                            (0, chai_1.expect)(updatedUser.profileBio).to.equal('new profile bio');
                            testUserViews(updatedUser);
                        });
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error when updating another user', async () => {
                const updaterUser = fakeTeacher;
                const updateeUser = await fakeDbUserFactory.createFakeDbTeacher();
                const { body, params } = routeData;
                body.profileBio = 'new profile bio';
                params.userId = updateeUser._id;
                currentAPIUser.userId = updaterUser._id;
                await testUserError();
            });
        });
    });
});
