"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let fakeDbTeacherFactory;
before(async () => {
    fakeDbTeacherFactory = await _1.makeFakeDbTeacherFactory;
});
describe('fakeDbTeacherFactory', () => {
    describe('createFakeDbData', () => {
        it('should create an fake teacher to embed', async () => {
            const newTeacher = await fakeDbTeacherFactory.createFakeData();
            (0, chai_1.expect)(newTeacher.packages.length).to.equal(7);
        });
    });
});
