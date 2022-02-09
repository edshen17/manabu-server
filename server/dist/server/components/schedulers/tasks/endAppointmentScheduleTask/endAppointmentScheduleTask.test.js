"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const appointment_1 = require("../../../dataAccess/services/appointment");
const fakeDbAppointmentFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
let fakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory;
let fakePackageTransaction;
let fakeAppointment;
let endAppointmentScheduleTask;
let appointmentDbService;
let dbServiceAccessOptions;
before(async () => {
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    fakeDbAppointmentFactory = await fakeDbAppointmentFactory_1.makeFakeDbAppointmentFactory;
    endAppointmentScheduleTask = await _1.makeEndAppointmentScheduleTask;
    appointmentDbService = await appointment_1.makeAppointmentDbService;
});
beforeEach(async () => {
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
        hostedById: fakePackageTransaction.hostedById,
        reservedById: fakePackageTransaction.reservedById,
        packageTransactionId: fakePackageTransaction._id,
        startDate: (0, dayjs_1.default)().subtract(10, 'days').toDate(),
        endDate: (0, dayjs_1.default)().subtract(4, 'day').toDate(),
    });
    dbServiceAccessOptions = appointmentDbService.getBaseDbServiceAccessOptions();
    fakeAppointment = await appointmentDbService.findOneAndUpdate({
        dbServiceAccessOptions,
        searchQuery: {
            _id: fakeAppointment._id,
        },
        updateQuery: {
            status: 'confirmed',
        },
    });
});
describe('endAppointmentScheduleTask', () => {
    it('should change the appointment status', async () => {
        (0, chai_1.expect)(fakeAppointment.status).to.equal('confirmed');
        await endAppointmentScheduleTask.execute();
        fakeAppointment = await appointmentDbService.findById({
            dbServiceAccessOptions,
            _id: fakeAppointment._id,
        });
        (0, chai_1.expect)(fakeAppointment.status).to.equal('completed');
    });
});
