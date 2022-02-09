"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
let cookieHandler;
let fakeDbUserFactory;
let fakeUser;
before(async () => {
    cookieHandler = await _1.makeCookieHandler;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
beforeEach(async () => {
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
});
describe('jwtHandler', () => {
    describe('splitLoginCookies', () => {
        it('should return a split jwt', () => {
            const cookieArr = cookieHandler.splitLoginCookies(fakeUser);
            (0, chai_1.expect)(cookieArr.length).to.equal(2);
            (0, chai_1.expect)(cookieArr[0].name).to.equal('hp');
        });
    });
});
