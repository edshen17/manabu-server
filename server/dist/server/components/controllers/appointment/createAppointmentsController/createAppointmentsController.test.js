"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let fakeDbPackageTransactionFactory;
let fakeDbAvailableTimeFactory;
let availableTimeDbService;
let firstFakePackageTransaction;
let secondFakePackageTransaction;
let fakeAvailableTime;
let currentAPIUser;
let body;
let createAppointmentsController;
let firstAppointment;
let secondAppointment;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
    availableTimeDbService = await availableTime_1.makeAvailableTimeDbService;
    createAppointmentsController = await _1.makeCreateAppointmentsController;
});
beforeEach(async () => {
    firstFakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    secondFakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
        hostedById: firstFakePackageTransaction.hostedById,
        startDate: (0, dayjs_1.default)().toDate(),
        endDate: (0, dayjs_1.default)().add(3, 'hour').toDate(),
    });
    body = {
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
    };
    currentAPIUser = {
        userId: firstFakePackageTransaction.reservedById,
        role: 'user',
    };
    firstAppointment = body.appointments[0];
    secondAppointment = body.appointments[1];
});
describe('createAppointmentsController', () => {
    describe('makeRequest', () => {
        const createAppointments = async () => {
            const createAppointmentsHttpRequest = iHttpRequestBuilder
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const createAppointments = await createAppointmentsController.makeRequest(createAppointmentsHttpRequest);
            return createAppointments;
        };
        context('valid inputs', () => {
            it('should create a new appointment', async () => {
                const createAppointmentsRes = await createAppointments();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(201);
                if ('appointments' in createAppointmentsRes.body) {
                    (0, chai_1.expect)(createAppointmentsRes.body.appointments[0].hostedById).to.deep.equal(firstFakePackageTransaction.hostedById);
                }
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                firstAppointment.startDate = new Date();
                const createAppointmentsRes = await createAppointments();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
            it('should throw an error if there is an appointment overlap', async () => {
                await createAppointments();
                const createAppointmentsRes = await createAppointments();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
            it('should throw an error if body contains an hostedById other than the currentAPIUser id', async () => {
                firstAppointment.hostedById = (0, convertStringToObjectId_1.convertStringToObjectId)('507f1f77bcf86cd799439011');
                const createAppointmentsRes = await createAppointments();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
            it('should throw an error if body contains an foreign keys that do not exist', async () => {
                firstAppointment.hostedById = (0, convertStringToObjectId_1.convertStringToObjectId)('507f1f77bcf86cd799439011');
                firstAppointment.reservedById = (0, convertStringToObjectId_1.convertStringToObjectId)('507f1f77bcf86cd799439011');
                firstAppointment.packageTransactionId = (0, convertStringToObjectId_1.convertStringToObjectId)('507f1f77bcf86cd799439011');
                const createAppointmentsRes = await createAppointments();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
            it('should throw an error if the lesson duration is wrong', async () => {
                firstAppointment.endDate = (0, dayjs_1.default)(firstAppointment.endDate).add(1, 'hour').toDate();
                const createAppointmentsRes = await createAppointments();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
            it('should throw an error if no corresponding available time exists', async () => {
                firstAppointment.startDate = (0, dayjs_1.default)().add(5, 'hour').toDate();
                firstAppointment.endDate = (0, dayjs_1.default)().add(6, 'hour').toDate();
                const createAppointmentsRes = await createAppointments();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
            it('should throw an error if appointment goes over available time', async () => {
                firstAppointment.startDate = (0, dayjs_1.default)(firstAppointment.startDate).add(3, 'hour').toDate();
                firstAppointment.endDate = (0, dayjs_1.default)(firstAppointment.startDate).add(4, 'hour').toDate();
                const createAppointmentsRes = await createAppointments();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
            it('should throw an error if one of the appointments is not of the same type', async () => {
                secondAppointment.packageTransactionId = secondFakePackageTransaction._id;
                const createAppointmentsRes = await createAppointments();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
            it('should throw an error if the user is not logged in', async () => {
                currentAPIUser.userId = undefined;
                const createAppointmentsRes = await createAppointments();
                (0, chai_1.expect)(createAppointmentsRes.statusCode).to.equal(409);
            });
        });
    });
});
