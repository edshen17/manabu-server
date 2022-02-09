"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fakeDbUserFactory_1 = require("../../dataAccess/testFixtures/fakeDbUserFactory");
const index_1 = require("./index");
let fakeDbUserFactory;
let packageEntity;
let fakeUser;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    packageEntity = await index_1.makePackageEntity;
    fakeUser = await fakeDbUserFactory.createFakeDbTeacher();
});
context('package entity', () => {
    describe('build', async () => {
        context('given valid inputs', () => {
            it('should return a package entity object', async () => {
                const fakePackage = await packageEntity.build({
                    lessonAmount: 5,
                    isOffering: true,
                    lessonDurations: [30],
                    name: 'light',
                    type: 'default',
                });
                (0, chai_1.expect)(fakePackage.lessonAmount).to.equal(5);
                (0, chai_1.expect)(fakePackage.isOffering).to.equal(true);
                (0, chai_1.expect)(fakePackage.lessonDurations.length).to.equal(1);
                (0, chai_1.expect)(fakePackage.type).to.equal('default');
            });
        });
        context('given invalid inputs', () => {
            it('should throw an error', async () => {
                try {
                    const entityData = {};
                    const fakePackage = await packageEntity.build(entityData);
                }
                catch (err) {
                    (0, chai_1.expect)(err).to.be.an('error');
                }
            });
        });
    });
});
