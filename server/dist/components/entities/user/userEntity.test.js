"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const index_1 = require("./index");
const expect = chai_1.default.expect;
describe('user entity', () => {
    it('should get the correct data provided good input', () => {
        const testEntity = index_1.makeUserEntity.build({
            name: 'test',
            password: 'pass',
            email: 'test@gmail.com',
        });
        expect(testEntity.name).to.equal('test');
        expect(testEntity.password).to.not.equal('pass');
        expect(testEntity.email).to.equal('test@gmail.com');
        expect(testEntity.profileImage).to.equal('');
        expect(testEntity.verificationToken).to.not.equal('');
    });
});
