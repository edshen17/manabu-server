"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let fakeDbAvailableTimeFactory;
before(async () => {
    fakeDbAvailableTimeFactory = await _1.makeFakeDbAvailableTimeFactory;
});
describe('fakeDbAvailableTimeFactory', () => {
    describe('createFakeDbData', () => {
        it('should create an fake teacher to embed', async () => {
            const fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
            (0, chai_1.expect)(fakeAvailableTime).to.have.property('hostedById');
            (0, chai_1.expect)(fakeAvailableTime).to.have.property('startDate');
            (0, chai_1.expect)(fakeAvailableTime).to.have.property('endDate');
        });
    });
});
