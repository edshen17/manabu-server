"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const graph_1 = require("../../../dataAccess/services/graph");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let getUserTeacherEdgesController;
let iHttpRequestBuilder;
let fakeDbUserFactory;
let fakeUser;
let fakeTeacher;
let graphDbService;
let body;
let currentAPIUser;
let params;
let path;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    getUserTeacherEdgesController = await _1.makeGetUserTeacherEdgesController;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    graphDbService = await graph_1.makeGraphDbService;
});
beforeEach(async () => {
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
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
    params = {
        userId: fakeTeacher._id,
    };
    body = {};
    currentAPIUser = {
        role: 'teacher',
        userId: fakeTeacher._id,
    };
    path = '';
});
describe('getUserTeacherEdgesController', () => {
    describe('makeRequest', () => {
        const getUserTeacherEdges = async () => {
            const getUserTeacherEdgesHttpReq = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .path(path)
                .build();
            const getUserTeacherEdgesHttpRes = await getUserTeacherEdgesController.makeRequest(getUserTeacherEdgesHttpReq);
            return getUserTeacherEdgesHttpRes;
        };
        const testValidGetUserTeacherEdges = async () => {
            const getUserTeacherEdgesRes = await getUserTeacherEdges();
            (0, chai_1.expect)(getUserTeacherEdgesRes.statusCode).to.equal(200);
            if ('users' in getUserTeacherEdgesRes.body) {
                (0, chai_1.expect)(getUserTeacherEdgesRes.body.users.length > 0).to.equal(true);
            }
        };
        const testInvalidGetUserTeacherEdges = async () => {
            const getGetUserTeacherEdgesRes = await getUserTeacherEdges();
            (0, chai_1.expect)(getGetUserTeacherEdgesRes.statusCode).to.equal(404);
        };
        context('valid inputs', () => {
            context('as a non-admin user', () => {
                context('viewing self', () => {
                    it("should get the teacher's students", async () => {
                        path = '/self';
                        params = {};
                        await testValidGetUserTeacherEdges();
                    });
                    it("should get the student's teachers", async () => {
                        path = '/self';
                        params = {};
                        currentAPIUser = {
                            userId: fakeUser._id,
                            teacherId: undefined,
                            role: fakeUser.role,
                        };
                        await testValidGetUserTeacherEdges();
                    });
                });
                context('viewing other', () => {
                    it('should throw an error', async () => {
                        currentAPIUser.userId = fakeUser._id;
                        await testInvalidGetUserTeacherEdges();
                    });
                });
            });
            context('as an admin', () => {
                context('viewing other', () => {
                    it("should get the teacher's students", async () => {
                        currentAPIUser.role = 'admin';
                        await testValidGetUserTeacherEdges();
                    });
                });
            });
            context('as an unlogged-in user', async () => {
                it('should throw an error', async () => {
                    currentAPIUser = { role: 'user', userId: undefined };
                    await testInvalidGetUserTeacherEdges();
                });
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if no user is found', async () => {
                params = {};
                await testInvalidGetUserTeacherEdges();
            });
            it('should throw an error if an invalid id is given', async () => {
                params = { _id: 'undefined' };
                await testInvalidGetUserTeacherEdges();
            });
        });
    });
});
