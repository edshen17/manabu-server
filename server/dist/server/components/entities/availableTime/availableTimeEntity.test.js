"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fakeDbUserFactory_1 = require("../../dataAccess/testFixtures/fakeDbUserFactory");
const index_1 = require("./index");
let fakeDbUserFactory;
let availableTimeEntity;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    availableTimeEntity = await index_1.makeAvailableTimeEntity;
});
describe('availableTimeEntity', () => {
    describe('build', () => {
        context('given valid inputs', () => {
            it('should return given inputs', async () => {
                const fakeHostedBy = await fakeDbUserFactory.createFakeDbUser();
                const endDate = new Date();
                endDate.setMinutes(endDate.getMinutes() + 30);
                const fakeAvailableTime = await availableTimeEntity.build({
                    hostedById: fakeHostedBy._id,
                    startDate: new Date(),
                    endDate,
                });
                (0, chai_1.expect)(fakeAvailableTime.hostedById).to.deep.equal(fakeHostedBy._id);
            });
        });
        context('given invalid inputs', () => {
            it('should throw an error', async () => {
                try {
                    const entityData = {};
                    const fakeAvailableTime = await availableTimeEntity.build(entityData);
                }
                catch (err) {
                    (0, chai_1.expect)(err).to.be.an('error');
                }
            });
        });
    });
});
