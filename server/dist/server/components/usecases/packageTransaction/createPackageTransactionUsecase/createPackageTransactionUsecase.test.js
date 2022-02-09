"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPackageTransaction = void 0;
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const teacher_1 = require("../../../dataAccess/services/teacher");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const teacherEntity_1 = require("../../../entities/teacher/teacherEntity");
const createPackageTransactionCheckoutUsecase_1 = require("../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbUserFactory;
let fakeDbAvailableTimeFactory;
let fakeTeacher;
let fakeAvailableTime;
let createPackageTransactionUsecase;
let createPackageTransactionCheckoutUsecase;
let createPackageTransactionUsecaseRouteData;
let createPackageTransactionCheckoutRouteData;
let fakeUser;
let currentAPIUser;
let teacherDbService;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createPackageTransactionUsecase = await _1.makeCreatePackageTransactionUsecase;
    createPackageTransactionCheckoutUsecase = await createPackageTransactionCheckoutUsecase_1.makeCreatePackageTransactionCheckoutUsecase;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    teacherDbService = await teacher_1.makeTeacherDbService;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
});
beforeEach(async () => {
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    const startDate = (0, dayjs_1.default)().toDate();
    const endDate = (0, dayjs_1.default)().add(1, 'hour').toDate();
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
        hostedById: fakeTeacher._id,
        startDate,
        endDate,
    });
    currentAPIUser = {
        userId: fakeUser._id,
        role: fakeUser.role,
    };
    createPackageTransactionCheckoutRouteData = {
        rawBody: {},
        headers: {},
        params: {},
        body: {
            teacherId: fakeTeacher.teacherData._id,
            packageId: fakeTeacher.teacherData.packages[3]._id,
            lessonDuration: 60,
            lessonLanguage: 'ja',
            timeslots: [{ startDate, endDate }],
        },
        query: {
            paymentGateway: 'paypal',
        },
        endpointPath: '',
    };
    createPackageTransactionUsecaseRouteData = {
        rawBody: {},
        params: {},
        body: {},
        query: {},
        endpointPath: '',
        headers: {},
    };
});
const createPackageTransaction = async () => {
    const createPackageTransactionCheckoutControllerData = controllerDataBuilder
        .routeData(createPackageTransactionCheckoutRouteData)
        .currentAPIUser(currentAPIUser)
        .build();
    const createPackageTransactionCheckoutRes = await createPackageTransactionCheckoutUsecase.makeRequest(createPackageTransactionCheckoutControllerData);
    const { token } = createPackageTransactionCheckoutRes;
    createPackageTransactionUsecaseRouteData.query = {
        token,
        paymentId: 'some payment id',
    };
    const createPackageTransactionControllerData = controllerDataBuilder
        .routeData(createPackageTransactionUsecaseRouteData)
        .currentAPIUser(currentAPIUser)
        .build();
    const createPackageTransactionRes = await createPackageTransactionUsecase.makeRequest(createPackageTransactionControllerData);
    return createPackageTransactionRes;
};
exports.createPackageTransaction = createPackageTransaction;
describe('createPackageTransactionUsecase', () => {
    describe('makeRequest', () => {
        const testPackageTransactionError = async () => {
            let error;
            try {
                await createPackageTransaction();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if token has been used more than once', async () => {
                    await createPackageTransaction();
                    let error;
                    try {
                        // cannot reuse testPackageTransactionError here because it overwrites the blacklisted jwt during checkout
                        const createPackageTransactionControllerData = controllerDataBuilder
                            .routeData(createPackageTransactionUsecaseRouteData)
                            .currentAPIUser(currentAPIUser)
                            .build();
                        const createPackageTransactionRes = await createPackageTransactionUsecase.makeRequest(createPackageTransactionControllerData);
                    }
                    catch (err) {
                        error = err;
                    }
                    (0, chai_1.expect)(error).to.be.an('error');
                });
                it('should throw an error if body is invalid', async () => {
                    createPackageTransactionCheckoutRouteData.body = {};
                    await testPackageTransactionError();
                });
            });
            context('valid inputs', () => {
                const validResOutput = (createPackageTransactionRes) => {
                    const { packageTransaction, balanceTransactions, incomeReport, user } = createPackageTransactionRes;
                    const studentDebitBalanceTransaction = balanceTransactions[0];
                    const studentCreditBalanceTransaction = balanceTransactions[1];
                    const teacherBalanceTransaction = balanceTransactions[2];
                    (0, chai_1.expect)(user.memberships.length > 0).to.equal(true);
                    (0, chai_1.expect)(packageTransaction).to.have.property('hostedById');
                    (0, chai_1.expect)(packageTransaction).to.have.property('reservedById');
                    (0, chai_1.expect)(packageTransaction).to.have.property('packageId');
                    (0, chai_1.expect)(balanceTransactions.length == 3).to.equal(true);
                    (0, chai_1.expect)(studentDebitBalanceTransaction.balanceChange +
                        studentDebitBalanceTransaction.processingFee).to.equal(studentDebitBalanceTransaction.totalPayment);
                    (0, chai_1.expect)(studentCreditBalanceTransaction.balanceChange < 0 &&
                        studentCreditBalanceTransaction.totalPayment == 0).to.equal(true);
                    (0, chai_1.expect)(teacherBalanceTransaction.processingFee < 0).to.equal(true);
                    (0, chai_1.expect)(incomeReport.revenue > 0).to.equal(true);
                };
                it('should create a packageTransaction and 3 balanceTransactions', async () => {
                    const createPackageTransactionRes = await createPackageTransaction();
                    validResOutput(createPackageTransactionRes);
                });
                it('should return correct balance transaction rates if pro teacher', async () => {
                    const dbServiceAccessOptions = teacherDbService.getBaseDbServiceAccessOptions();
                    await teacherDbService.findOneAndUpdate({
                        searchQuery: {
                            _id: fakeTeacher.teacherData._id,
                        },
                        updateQuery: {
                            type: teacherEntity_1.TEACHER_ENTITY_TYPE.LICENSED,
                        },
                        dbServiceAccessOptions,
                    });
                    const createPackageTransactionRes = await createPackageTransaction();
                    validResOutput(createPackageTransactionRes);
                });
            });
        });
    });
});
