"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let fakeDbUserFactory;
let editTeacherController;
let iHttpRequestBuilder;
let fakeUser;
let fakeTeacher;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    editTeacherController = await _1.makeEditTeacherController;
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
});
beforeEach(async () => {
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
});
describe('editTeacherController', () => {
    describe('makeRequest', () => {
        it('should edit the given teacher and return a restricted view', async () => {
            const editTeacherHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: fakeTeacher._id,
                role: fakeTeacher.role,
                teacherId: fakeTeacher.teacherData._id,
            })
                .params({ teacherId: fakeTeacher.teacherData._id })
                .body({
                licenseUrl: 'https://fakeimg.pl/300/',
            })
                .build();
            const editTeacherRes = await editTeacherController.makeRequest(editTeacherHttpRequest);
            (0, chai_1.expect)(editTeacherRes.statusCode).to.equal(200);
            if ('user' in editTeacherRes.body) {
                (0, chai_1.expect)(editTeacherRes.body.user.teacherData.licenseUrl).to.equal('https://fakeimg.pl/300/');
            }
        });
        it('should not edit the user and deny access (editing other)', async () => {
            const editTeacherHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: fakeTeacher._id,
                role: fakeTeacher.role,
            })
                .params({ uId: fakeUser._id })
                .body({
                name: 'new name',
            })
                .build();
            const editTeacherRes = await editTeacherController.makeRequest(editTeacherHttpRequest);
            (0, chai_1.expect)(editTeacherRes.statusCode).to.equal(401);
        });
        it('should not edit the teacher and deny access (editing self but with restricted properties)', async () => {
            const editTeacherHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: fakeTeacher._id,
                role: fakeTeacher.role,
            })
                .params({ uId: fakeUser._id })
                .body({
                _id: 'new id',
                userId: 'new id',
                lessonCount: 5,
                studentCount: 5,
            })
                .build();
            const editTeacherRes = await editTeacherController.makeRequest(editTeacherHttpRequest);
            (0, chai_1.expect)(editTeacherRes.statusCode).to.equal(401);
        });
        it('should throw an error if user to edit is not found', async () => {
            const editTeacherHttpRequest = iHttpRequestBuilder
                .currentAPIUser({
                userId: fakeTeacher._id,
                role: fakeTeacher.role,
            })
                .params({ uId: undefined })
                .body({
                licenseUrl: 'new license path',
            })
                .build();
            const editTeacherRes = await editTeacherController.makeRequest(editTeacherHttpRequest);
            (0, chai_1.expect)(editTeacherRes.statusCode).to.equal(401);
        });
    });
});
