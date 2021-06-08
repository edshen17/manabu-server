"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const usersDb_test_1 = require("../../dataAccess/services/usersDb.test");
const index_1 = require("./index");
const expect = chai_1.default.expect;
const assert = chai_1.default.assert;
context('minuteBank entity', () => {
    describe('build', () => {
        describe('given valid inputs', () => {
            it('should return given inputs', async () => {
                const minuteBankEntity = await index_1.makeMinuteBankEntity;
                const fakeHostedBy = await usersDb_test_1.createFakeDbUser(false);
                const fakeReservedBy = await usersDb_test_1.createFakeDbUser(false);
                const testMinuteBank = await minuteBankEntity.build({
                    hostedBy: fakeHostedBy._id,
                    reservedBy: fakeReservedBy._id,
                    minuteBank: 5,
                });
                expect(testMinuteBank.hostedBy).to.equal(fakeHostedBy._id);
                expect(testMinuteBank.reservedBy).to.equal(fakeReservedBy._id);
                expect(testMinuteBank.minuteBank).to.equal(5);
                expect(testMinuteBank).to.have.property('hostedByData');
                expect(testMinuteBank).to.have.property('reservedByData');
            });
        });
    });
});
