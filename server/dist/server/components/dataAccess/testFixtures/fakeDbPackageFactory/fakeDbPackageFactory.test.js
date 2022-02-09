"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const package_1 = require("../../services/package");
const fakeDbUserFactory_1 = require("../fakeDbUserFactory");
let packageDbService;
let fakeDbUserFactory;
let fakeDbPackageFactory;
let fakeTeacher;
before(async () => {
    packageDbService = await package_1.makePackageDbService;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    fakeDbPackageFactory = await _1.makeFakeDbPackageFactory;
});
beforeEach(async () => {
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
});
describe('fakeDbPackageFactory', () => {
    describe('createFakeDbData', () => {
        it('should create fake db packages', async () => {
            const fakePackages = await fakeDbPackageFactory.createFakePackages();
            (0, chai_1.expect)(fakePackages.length).to.equal(4);
        });
    });
});
