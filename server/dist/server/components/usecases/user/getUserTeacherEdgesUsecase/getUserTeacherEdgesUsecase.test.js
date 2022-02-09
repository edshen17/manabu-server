"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const graph_1 = require("../../../dataAccess/services/graph");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let getUserTeacherEdgesUsecase;
let fakeDbUserFactory;
let graphDbService;
let controllerDataBuilder;
let fakeUser;
let fakeTeacher;
let routeData;
let currentAPIUser;
before(async () => {
    getUserTeacherEdgesUsecase = await _1.makeGetUserTeacherEdgesUsecase;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    graphDbService = await graph_1.makeGraphDbService;
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
        role: 'teacher',
    };
    const query = `MATCH (teacher:User{ _id: "${fakeTeacher._id}" }),
  (student:User{ _id: "${fakeUser._id}" }) MERGE (teacher)-[r:teaches {since: "${new Date().toISOString()}"}]->(student)`;
    await graphDbService.graphQuery({
        query,
        dbServiceAccessOptions: {
            isCurrentAPIUserPermitted: true,
            currentAPIUserRole: 'user',
            isSelf: false,
        },
    });
});
describe('getUserTeacherEdgesUsecase', () => {
    describe('makeRequest', () => {
        const getUserTeacherEdges = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const getUserTeacherEdgesRes = await getUserTeacherEdgesUsecase.makeRequest(controllerData);
            const { users } = getUserTeacherEdgesRes;
            return users;
        };
        const testUserTeacherEdges = async () => {
            const users = await getUserTeacherEdges();
            const user = users[0];
            const { role } = currentAPIUser;
            if (['admin', 'teacher'].includes(role)) {
                (0, chai_1.expect)(user._id.toString()).to.equal(fakeUser._id.toString());
            }
            else {
                (0, chai_1.expect)(user._id.toString()).to.equal(fakeTeacher._id.toString());
            }
        };
        const testUserTeacherEdgesError = async () => {
            let error;
            try {
                await getUserTeacherEdges();
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
                    await testUserTeacherEdgesError();
                });
                it('should throw an error if an invalid id is given', async () => {
                    routeData.params = { _id: 'undefined' };
                    await testUserTeacherEdgesError();
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it("should get the teacher's students", async () => {
                            routeData.endpointPath = '/self';
                            routeData.params = {};
                            await testUserTeacherEdges();
                        });
                        it("should get the student's teachers", async () => {
                            routeData.endpointPath = '/self';
                            routeData.params = {};
                            currentAPIUser = {
                                userId: fakeUser._id,
                                teacherId: undefined,
                                role: fakeUser.role,
                            };
                            await testUserTeacherEdges();
                        });
                    });
                    context('viewing other', () => {
                        it('should throw an error', async () => {
                            currentAPIUser.userId = fakeUser._id;
                            await testUserTeacherEdgesError();
                        });
                    });
                });
                context('as an admin', () => {
                    context('viewing other', () => {
                        it("should get the teacher's students", async () => {
                            currentAPIUser.role = 'admin';
                            await testUserTeacherEdges();
                        });
                    });
                });
                context('as an unlogged-in user', async () => {
                    it('should throw an error', async () => {
                        currentAPIUser = { role: 'user', userId: undefined };
                        await testUserTeacherEdgesError();
                    });
                });
            });
        });
    });
});
