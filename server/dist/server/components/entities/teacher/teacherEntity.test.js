"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let teacherEntity;
before(async () => {
    teacherEntity = await _1.makeTeacherEntity;
});
describe('teacher entity', () => {
    describe('build', () => {
        context('given valid inputs', () => {
            it('should create a teacher with the given user id', () => {
                const fakeTeacher = teacherEntity.build({});
                (0, chai_1.expect)(fakeTeacher.type).to.equal('unlicensed');
            });
        });
    });
});
