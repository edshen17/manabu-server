"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const index_1 = require("./index");
const expect = chai_1.default.expect;
describe('teacher entity', () => {
    describe('given valid inputs', () => {
        it('should get correct user id given valid inputs', () => {
            const testTeacher = index_1.makeTeacherEntity.build({ userId: '123lsjadnasda' });
            expect(testTeacher.userId).to.equal('123lsjadnasda');
        });
    });
});
