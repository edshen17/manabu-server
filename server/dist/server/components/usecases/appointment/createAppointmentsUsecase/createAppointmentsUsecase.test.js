"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const packageTransaction_1 = require("../../../dataAccess/services/packageTransaction");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbPackageTransactionFactory;
let fakeDbAvailableTimeFactory;
let createAppointmentsUsecase;
let routeData;
let firstFakePackageTransaction;
let secondFakePackageTransaction;
let fakeAvailableTime;
let currentAPIUser;
let availableTimeDbService;
let packageTransactionDbService;
let firstAppointment;
let secondAppointment;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createAppointmentsUsecase = await _1.makeCreateAppointmentsUsecase;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
    availableTimeDbService = await availableTime_1.makeAvailableTimeDbService;
    packageTransactionDbService = await packageTransaction_1.makePackageTransactionDbService;
});
beforeEach(async () => {
    firstFakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    secondFakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
        hostedById: firstFakePackageTransaction.hostedById,
        startDate: (0, dayjs_1.default)().toDate(),
        endDate: (0, dayjs_1.default)().add(3, 'hour').toDate(),
    });
    currentAPIUser = {
        userId: firstFakePackageTransaction.reservedById,
        role: 'user',
    };
    routeData = {
        params: {},
        body: {
            appointments: [
                {
                    hostedById: firstFakePackageTransaction.hostedById,
                    packageTransactionId: firstFakePackageTransaction._id,
                    startDate: fakeAvailableTime.startDate,
                    endDate: (0, dayjs_1.default)(fakeAvailableTime.startDate).add(1, 'hour').toDate(),
                },
                {
                    hostedById: firstFakePackageTransaction.hostedById,
                    packageTransactionId: firstFakePackageTransaction._id,
                    startDate: (0, dayjs_1.default)(fakeAvailableTime.startDate).add(1, 'hour').toDate(),
                    endDate: (0, dayjs_1.default)(fakeAvailableTime.startDate).add(2, 'hour').toDate(),
                },
            ],
        },
        rawBody: {},
        query: {},
        endpointPath: '',
        headers: {},
    };
    firstAppointment = routeData.body.appointments[0];
    secondAppointment = routeData.body.appointments[1];
});
describe('createAppointmentUsecase', () => {
    describe('makeRequest', () => {
        const createAppointments = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const createAppointmentRes = await createAppointmentsUsecase.makeRequest(controllerData);
            return createAppointmentRes;
        };
        const testAppointmentsError = async () => {
            let error;
            try {
                await createAppointments();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if body is invalid', async () => {
                    firstAppointment.hostedById = 'some id';
                    firstAppointment.createdDate = new Date();
                    await testAppointmentsError();
                });
                it('should throw an error if there is an appointment overlap', async () => {
                    try {
                        await createAppointments();
                        await createAppointments();
                    }
                    catch (err) {
                        (0, chai_1.expect)(err).to.be.an('error');
                    }
                });
                it('should throw an error if body contains an hostedById other than the currentAPIUser id', async () => {
                    firstAppointment.hostedById = '507f1f77bcf86cd799439011';
                    await testAppointmentsError();
                });
                it('should throw an error if body contains an foreign keys that do not exist', async () => {
                    firstAppointment.hostedById = '507f1f77bcf86cd799439011';
                    firstAppointment.reservedById = '507f1f77bcf86cd799439011';
                    firstAppointment.packageTransactionId = '507f1f77bcf86cd799439011';
                    await testAppointmentsError();
                });
                it('should throw an error if the lesson duration is wrong', async () => {
                    firstAppointment.endDate = (0, dayjs_1.default)(firstAppointment.endDate).add(1, 'hour').toDate();
                    await testAppointmentsError();
                });
                it('should throw an error if no corresponding available time exists', async () => {
                    firstAppointment.startDate = (0, dayjs_1.default)().add(5, 'hour').toDate();
                    firstAppointment.endDate = (0, dayjs_1.default)().add(6, 'hour').toDate();
                    await testAppointmentsError();
                });
                it('should throw an error if appointment goes over available time', async () => {
                    firstAppointment.endDate = (0, dayjs_1.default)(firstAppointment.endDate).add(1, 'hour').toDate();
                    await testAppointmentsError();
                });
                it('should throw an error if user is not logged in', async () => {
                    currentAPIUser.userId = undefined;
                    await testAppointmentsError();
                });
                it('should throw an error if one of the appointments is not of the same type', async () => {
                    secondAppointment.packageTransactionId = secondFakePackageTransaction._id;
                    await testAppointmentsError();
                });
            });
            context('valid inputs', () => {
                const validResOutput = async (createAppointmentRes) => {
                    const appointments = createAppointmentRes.appointments;
                    const firstAppointment = createAppointmentRes.appointments[0];
                    const dbServiceAccessOptions = packageTransactionDbService.getBaseDbServiceAccessOptions();
                    const updatedPackageTransaction = await packageTransactionDbService.findById({
                        _id: firstAppointment.packageTransactionId,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(appointments.length).to.equal(2);
                    (0, chai_1.expect)(firstAppointment).to.have.property('hostedById');
                    (0, chai_1.expect)(firstAppointment).to.have.property('startDate');
                    (0, chai_1.expect)(firstAppointment).to.have.property('endDate');
                    (0, chai_1.expect)(firstAppointment).to.have.property('packageTransactionData');
                    (0, chai_1.expect)(updatedPackageTransaction.remainingAppointments <
                        firstFakePackageTransaction.remainingAppointments).to.equal(true);
                };
                it('should return a new appointment', async () => {
                    const createAppointmentRes = await createAppointments();
                    await validResOutput(createAppointmentRes);
                });
            });
        });
    });
});
