"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const fakeDbPackageTransactionFactory_1 = require("../fakeDbPackageTransactionFactory");
let fakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory;
before(async () => {
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    fakeDbAppointmentFactory = await _1.makeFakeDbAppointmentFactory;
});
describe('fakeDbAppointmentFactory', () => {
    describe('createFakeDbData', () => {
        it('should create a fake appointment from the given users and package transaction', async () => {
            const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
            const fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
                hostedById: fakePackageTransaction.hostedById,
                reservedById: fakePackageTransaction.reservedById,
                packageTransactionId: fakePackageTransaction._id,
                startDate: (0, dayjs_1.default)().toDate(),
                endDate: (0, dayjs_1.default)().add(30, 'minute').toDate(),
            });
            (0, chai_1.expect)(fakeAppointment).to.have.property('hostedById');
        });
        it('should create a fake appointment from without any input', async () => {
            const fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData();
            (0, chai_1.expect)(fakeAppointment).to.have.property('hostedById');
        });
    });
});
