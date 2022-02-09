"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const fakeDbAppointmentFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAppointmentFactory");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
let splitAvailableTimeHandler;
let fakeDbAppointmentFactory;
let fakeDbAvailableTimeFactory;
let fakeDbPackageTransactionFactory;
let fakeAppointment;
let fakeAvailableTime;
let fakePackageTransaction;
let availableTimeDbService;
let dbServiceAccessOptions;
before(async () => {
    splitAvailableTimeHandler = await _1.makeSplitAvailableTimeHandler;
    fakeDbAppointmentFactory = await fakeDbAppointmentFactory_1.makeFakeDbAppointmentFactory;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    availableTimeDbService = await availableTime_1.makeAvailableTimeDbService;
});
beforeEach(async () => {
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    dbServiceAccessOptions = availableTimeDbService.getBaseDbServiceAccessOptions();
});
describe('splitAvailableTimeHandler', () => {
    context('valid input', () => {
        const splitAvailableTime = async (props) => {
            const { availableTimeStartDate, availableTimeEndDate, appointmentStartDate, appointmentEndDate, } = props;
            fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
                hostedById: fakePackageTransaction.hostedById,
                startDate: availableTimeStartDate,
                endDate: availableTimeEndDate,
            });
            fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
                hostedById: fakePackageTransaction.hostedById,
                reservedById: fakePackageTransaction.reservedById,
                packageTransactionId: fakePackageTransaction._id,
                startDate: appointmentStartDate,
                endDate: appointmentEndDate,
            });
            await splitAvailableTimeHandler.split([fakeAppointment]);
            const updatedAvailableTime = await availableTimeDbService.findOne({
                searchQuery: {
                    hostedById: fakeAppointment.hostedById,
                },
                dbServiceAccessOptions,
            });
            return updatedAvailableTime;
        };
        context("appointment startTime is the same as availableTime's startTime", () => {
            it('should split the availableTime so that it starts at the end of the appointment', async () => {
                const splitAvailableTimeParams = {
                    availableTimeStartDate: (0, dayjs_1.default)().toDate(),
                    availableTimeEndDate: (0, dayjs_1.default)().add(3, 'hour').toDate(),
                    appointmentStartDate: (0, dayjs_1.default)().toDate(),
                    appointmentEndDate: (0, dayjs_1.default)().add(1, 'hour').toDate(),
                };
                const updatedAvailableTime = await splitAvailableTime(splitAvailableTimeParams);
                (0, chai_1.expect)((0, dayjs_1.default)(updatedAvailableTime.startDate).isSame((0, dayjs_1.default)(fakeAvailableTime.startDate), 'minute')).to.equal(false);
                (0, chai_1.expect)((0, dayjs_1.default)(updatedAvailableTime.endDate).isSame((0, dayjs_1.default)(fakeAvailableTime.endDate), 'minute')).to.equal(true);
                (0, chai_1.expect)((0, dayjs_1.default)(updatedAvailableTime.startDate).isSame((0, dayjs_1.default)(splitAvailableTimeParams.appointmentEndDate), 'minute')).to.equal(true);
            });
        });
        context("appointment startTime and endTime is not the same as availableTime's startTime and endTime", () => {
            it('should split the availableTime so that there is one before the appointment and one after', async () => {
                const splitAvailableTimeParams = {
                    availableTimeStartDate: (0, dayjs_1.default)().toDate(),
                    availableTimeEndDate: (0, dayjs_1.default)().add(3, 'hour').toDate(),
                    appointmentStartDate: (0, dayjs_1.default)().add(1, 'hour').toDate(),
                    appointmentEndDate: (0, dayjs_1.default)().add(2, 'hour').toDate(),
                };
                const updatedAvailableTime = await splitAvailableTime(splitAvailableTimeParams);
                const newAvailableTime = await availableTimeDbService.findOne({
                    searchQuery: {
                        hostedById: fakePackageTransaction.hostedById,
                        startDate: splitAvailableTimeParams.appointmentStartDate,
                    },
                    dbServiceAccessOptions,
                });
                (0, chai_1.expect)((0, dayjs_1.default)(updatedAvailableTime.startDate).isSame((0, dayjs_1.default)(fakeAvailableTime.startDate))).to.equal(true);
                (0, chai_1.expect)((0, dayjs_1.default)(updatedAvailableTime.endDate).isSame((0, dayjs_1.default)(fakeAvailableTime.startDate).add(1, 'hour'))).to.equal(true);
                (0, chai_1.expect)(newAvailableTime).to.equal(null);
            });
        });
        context("appointment endTime is the same as availableTime's endTime", () => {
            it('should split the availableTime so that it ends at the start of the appointment', async () => {
                const splitAvailableTimeParams = {
                    availableTimeStartDate: (0, dayjs_1.default)().toDate(),
                    availableTimeEndDate: (0, dayjs_1.default)().add(3, 'hour').toDate(),
                    appointmentStartDate: (0, dayjs_1.default)().add(2, 'hour').toDate(),
                    appointmentEndDate: (0, dayjs_1.default)().add(3, 'hour').toDate(),
                };
                const updatedAvailableTime = await splitAvailableTime(splitAvailableTimeParams);
                (0, chai_1.expect)(updatedAvailableTime.endDate).to.not.deep.equal(fakeAvailableTime.endDate);
                (0, chai_1.expect)(updatedAvailableTime.startDate).to.deep.equal(fakeAvailableTime.startDate);
                (0, chai_1.expect)(updatedAvailableTime.endDate).to.deep.equal(splitAvailableTimeParams.appointmentStartDate);
            });
        });
    });
});
