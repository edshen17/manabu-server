"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const createUser_1 = require("../testFixtures/createUser");
const getUser_1 = require("../testFixtures/getUser");
const expect = chai_1.default.expect;
describe('getUserController', () => {
    describe('makeRequest', () => {
        it('should get a fake user with correct properties (self)', async () => {
            const viewer = await createUser_1.createUser();
            const searchedUserRes = await getUser_1.getUser(viewer.body.user, viewer.body.user);
            expect(searchedUserRes.body._id).to.equal(viewer.body.user._id);
            expect(searchedUserRes.body).to.have.property('settings');
            expect(searchedUserRes.body).to.not.have.property('password');
        });
        it('should get a fake user with correct properties (not self)', async () => {
            const viewee = await createUser_1.createUser();
            const viewer = await createUser_1.createUser();
            const searchedUserRes = await getUser_1.getUser(viewee.body.user, viewer.body.user);
            expect(searchedUserRes.body._id).to.equal(viewee.body.user._id);
            expect(searchedUserRes.body).to.not.have.property('settings');
            expect(searchedUserRes.body).to.not.have.property('password');
        });
    });
});
