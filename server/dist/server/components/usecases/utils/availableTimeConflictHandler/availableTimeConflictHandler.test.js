"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
let fakeDbUserFactory;
let fakeDbAvailableTimeFactory;
let fakeTeacher;
let fakeAvailableTime;
let availableTimeConflictHandler;
let body;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
    availableTimeConflictHandler = await _1.makeAvailableTimeConflictHandler;
});
beforeEach(async () => {
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    body = {
        hostedById: fakeTeacher._id,
        startDate: (0, dayjs_1.default)().minute(0).toDate(),
        endDate: (0, dayjs_1.default)().add(1, 'hour').toDate(),
    };
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData(body);
});
describe('availableTimeConflictHandler', () => {
    describe('testTime', () => {
        const testTime = async () => {
            const testTimeRes = await availableTimeConflictHandler.testTime(body);
            return testTimeRes;
        };
        const testTimeError = async () => {
            let error;
            try {
                error = await testTime();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('invalid inputs', () => {
            it('should throw an error if available time overlaps at the start', async () => {
                await testTimeError();
            });
            it('should throw an error if available time overlaps in the middle', async () => {
                body.startDate = (0, dayjs_1.default)().add(30, 'minutes').toDate();
                await testTimeError();
            });
            it('should throw an error if available time overlaps at the end', async () => {
                body.startDate = (0, dayjs_1.default)(body.endDate).subtract(30, 'minutes').toDate();
                body.endDate = (0, dayjs_1.default)().add(1, 'hour').toDate();
                await testTimeError();
            });
            it('should throw an error if available time is not divisible by 30mins', async () => {
                body.endDate = (0, dayjs_1.default)().add(1, 'minute').toDate();
                await testTimeError();
            });
            it('should throw an error if available time does not start at a valid time', async () => {
                body.startDate = (0, dayjs_1.default)().minute(1).toDate();
                body.endDate = (0, dayjs_1.default)().add(31, 'minute').toDate();
                await testTimeError();
            });
        });
        context('valid inputs', () => {
            it('should not throw an error', async () => {
                body.startDate = (0, dayjs_1.default)().minute(0).add(3, 'hour').toDate();
                body.endDate = (0, dayjs_1.default)().minute(0).add(4, 'hour').toDate();
                const validRes = await testTime();
                (0, chai_1.expect)(validRes).to.equal(undefined);
            });
        });
    });
});
