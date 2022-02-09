"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakeDbTeacherFactory = void 0;
const teacher_1 = require("../../../entities/teacher");
const fakeDbTeacherFactory_1 = require("./fakeDbTeacherFactory");
const makeFakeDbTeacherFactory = new fakeDbTeacherFactory_1.FakeDbTeacherFactory().init({
    makeEntity: teacher_1.makeTeacherEntity,
});
exports.makeFakeDbTeacherFactory = makeFakeDbTeacherFactory;
