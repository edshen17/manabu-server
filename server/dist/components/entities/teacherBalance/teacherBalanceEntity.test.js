"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const index_1 = require("./index");
const expect = chai_1.default.expect;
context('teacherBalance entity', () => {
    describe('build', () => {
        describe('given valid inputs', () => {
            it('should return given inputs', () => {
                const testTeacherBalance = index_1.makeTeacherBalanceEntity.build({
                    userId: 'some userId',
                });
                expect(testTeacherBalance.userId).to.equal('some userId');
            });
        });
    });
});
