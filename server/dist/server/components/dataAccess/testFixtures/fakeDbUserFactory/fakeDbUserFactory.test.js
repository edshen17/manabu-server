"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const faker_1 = __importDefault(require("faker"));
const _1 = require(".");
const user_1 = require("../../services/user");
let fakeDbUserFactory;
let userDbService;
before(async () => {
    fakeDbUserFactory = await _1.makeFakeDbUserFactory;
    userDbService = await user_1.makeUserDbService;
});
describe('fakeDbUserFactory', () => {
    describe('createFakeDbData', () => {
        it('should create a fake db user with the given properties', async () => {
            const fakeUser = await fakeDbUserFactory.createFakeDbData({
                name: 'test',
                password: 'St0nGP@ssword!',
                email: faker_1.default.internet.email(),
            });
            (0, chai_1.expect)(fakeUser).to.have.property('name');
        });
    });
    describe('createFakeDbUser', () => {
        it('should create a fake db user with a random name', async () => {
            const fakeUser = await fakeDbUserFactory.createFakeDbUser();
            (0, chai_1.expect)(fakeUser).to.have.property('name');
            (0, chai_1.expect)(fakeUser).to.have.property('profileImageUrl');
            (0, chai_1.expect)(fakeUser.name).to.not.equal('');
            (0, chai_1.expect)(fakeUser.profileImageUrl).to.not.equal('');
        });
    });
    describe('createFakeDbTeacherWithDefaultPackages', () => {
        it('should create a fake db teacher with default packages', async () => {
            const fakeDbTeacher = await fakeDbUserFactory.createFakeDbTeacher();
            const dbServiceAccessOptions = userDbService.getBaseDbServiceAccessOptions();
            const joinedTeacher = await userDbService.findById({
                _id: fakeDbTeacher._id,
                dbServiceAccessOptions,
            });
            (0, chai_1.expect)(fakeDbTeacher._id.toString()).to.equal(joinedTeacher._id.toString());
        });
    });
});
