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
let packageTransactionEntity;
context('packageTransaction entity', () => {
    describe('build', async () => {
        packageTransactionEntity = await index_1.makePackageTransactionEntity;
        describe('given valid inputs', () => {
            it('should return given inputs', async () => {
                const fakeUser = await usersDb_test_1.createFakeDbUser(true);
                const testPackageTransaction = await packageTransactionEntity.build({
                    hostedBy: fakeUser._id,
                    reservedBy: fakeUser._id,
                    packageId: fakeUser._id,
                    reservationLength: 60,
                    remainingAppointments: 5,
                });
                expect(testPackageTransaction.hostedBy).to.equal(fakeUser._id);
                expect(testPackageTransaction.reservedBy).to.equal(fakeUser._id);
                expect(testPackageTransaction).to.have.property('hostedByData');
                expect(testPackageTransaction.reservationLength).to.equal(60);
                expect(testPackageTransaction.remainingAppointments).to.equal(5);
                expect(testPackageTransaction.lessonLanguage).to.equal('ja');
                expect(testPackageTransaction.isSubscription).to.equal(false);
                expect(testPackageTransaction.terminationDate).to.be.an('date');
            });
        });
        describe('given invalid inputs', () => {
            it('should returned undefined if provided no input', () => {
                const testPackageTransaction = packageTransactionEntity.build({});
                expect(typeof testPackageTransaction.hostedBy).to.equal('undefined');
            });
        });
    });
});
