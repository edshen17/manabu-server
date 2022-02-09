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
const createPackageTransactionCheckoutUsecase_1 = require("../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbUserFactory;
let fakeDbAvailableTimeFactory;
let webhookHandler;
let fakeUser;
let fakeTeacher;
let fakeAvailableTime;
let currentAPIUser;
let createPackageTransactionCheckoutRouteData;
let createPackageTransactionCheckoutUsecase;
let token;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    webhookHandler = await _1.makeWebhookHandler;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
    createPackageTransactionCheckoutUsecase = await createPackageTransactionCheckoutUsecase_1.makeCreatePackageTransactionCheckoutUsecase;
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
            packageId: fakeTeacher.teacherData.packages[0]._id,
            lessonDuration: 60,
            lessonLanguage: 'ja',
            timeslots: [{ startDate, endDate }],
        },
        query: {
            paymentGateway: 'stripe',
        },
        endpointPath: '',
    };
    currentAPIUser = {
        userId: fakeUser._id,
        role: fakeUser.role,
    };
    const createPackageTransactionCheckoutControllerData = controllerDataBuilder
        .routeData(createPackageTransactionCheckoutRouteData)
        .currentAPIUser(currentAPIUser)
        .build();
    const createPackageTransactionCheckoutRes = await createPackageTransactionCheckoutUsecase.makeRequest(createPackageTransactionCheckoutControllerData);
    token = createPackageTransactionCheckoutRes.token;
});
describe('webhookHandler', () => {
    describe('createResource', () => {
        const createResource = async () => {
            const createResourceRes = await webhookHandler.createResource({
                token,
                currentAPIUser,
                paymentId: 'some payment id',
            });
            return createResourceRes;
        };
        const testCreateResourceError = async () => {
            let error;
            try {
                error = await createResource();
            }
            catch (err) {
                return;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('packageTransaction', () => {
            context('valid inputs', () => {
                const validResOutput = (createResourceRes) => {
                    const packageTransaction = createResourceRes.packageTransaction;
                    (0, chai_1.expect)(packageTransaction).to.have.property('_id');
                    (0, chai_1.expect)(packageTransaction).to.have.property('hostedById');
                    (0, chai_1.expect)(packageTransaction).to.have.property('reservedById');
                };
                it('should return a new packageTransaction', async () => {
                    const createResourceRes = await createResource();
                    validResOutput(createResourceRes);
                });
            });
            context('invalid inputs', () => {
                it('should throw an error', async () => {
                    token = 'bad token';
                    await testCreateResourceError();
                });
            });
        });
    });
});
