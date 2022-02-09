"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbUserFactory;
let createAvailableTimeUsecase;
let routeData;
let fakeUser;
let currentAPIUser;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createAvailableTimeUsecase = await _1.makeCreateAvailableTimeUsecase;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
beforeEach(async () => {
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    currentAPIUser = {
        userId: fakeUser._id,
        role: fakeUser.role,
    };
    routeData = {
        params: {},
        body: {
            startDate: (0, dayjs_1.default)().hour(7).minute(0).toDate(),
            endDate: (0, dayjs_1.default)().hour(7).minute(30).toDate(),
        },
        query: {},
        endpointPath: '',
        headers: {},
        rawBody: {},
    };
});
describe('createAvailableTimeUsecase', () => {
    describe('makeRequest', () => {
        const createAvailableTime = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const createAvailableTimeRes = await createAvailableTimeUsecase.makeRequest(controllerData);
            return createAvailableTimeRes;
        };
        const testAvailableTimeError = async () => {
            let error;
            try {
                await createAvailableTime();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if restricted fields found in body', async () => {
                    const routeDataBody = routeData.body;
                    routeDataBody.hostedById = 'some id';
                    routeDataBody.creationDate = new Date();
                    await testAvailableTimeError();
                });
                it('should throw an error when creating an invalid availableTime', async () => {
                    routeData.body.startDate = (0, dayjs_1.default)().hour(7).minute(29).toDate();
                    await testAvailableTimeError();
                });
            });
            context('valid inputs', () => {
                const validResOutput = (createAvailableTimeRes) => {
                    const availableTime = createAvailableTimeRes.availableTime;
                    (0, chai_1.expect)(availableTime).to.have.property('hostedById');
                    (0, chai_1.expect)(availableTime).to.have.property('startDate');
                    (0, chai_1.expect)(availableTime).to.have.property('endDate');
                };
                it('should return a new available time', async () => {
                    const createAvailableTimeRes = await createAvailableTime();
                    validResOutput(createAvailableTimeRes);
                });
            });
        });
    });
});
