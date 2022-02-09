"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbAvailableTimeFactory;
let editAvailableTimeUsecase;
let routeData;
let currentAPIUser;
let fakeAvailableTime;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    editAvailableTimeUsecase = await _1.makeEditAvailableTimeUsecase;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
});
beforeEach(async () => {
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
    routeData = {
        rawBody: {},
        headers: {},
        params: {
            availableTimeId: fakeAvailableTime._id,
        },
        body: {
            startDate: (0, dayjs_1.default)().minute(0).toDate(),
            endDate: (0, dayjs_1.default)().minute(30).toDate(),
        },
        query: {},
        endpointPath: '',
    };
    currentAPIUser = {
        role: 'user',
        userId: fakeAvailableTime.hostedById,
    };
});
describe('editAvailableTimeUsecase', () => {
    describe('makeRequest', () => {
        const editAvailableTime = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const editAvailableTimeUsecaseRes = await editAvailableTimeUsecase.makeRequest(controllerData);
            return editAvailableTimeUsecaseRes;
        };
        const testAvailableTimeError = async () => {
            let error;
            try {
                await editAvailableTime();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if not self/admin', async () => {
                    currentAPIUser.userId = undefined;
                    await testAvailableTimeError();
                });
                it('should throw if bad inputs are provided', async () => {
                    routeData.body = {
                        hostedById: 'some id',
                    };
                    await testAvailableTimeError();
                });
                it('should throw if invalid date', async () => {
                    routeData.body = {
                        startDate: (0, dayjs_1.default)().minute(1).toDate(),
                        endDate: (0, dayjs_1.default)().minute(2).toDate(),
                    };
                    await testAvailableTimeError();
                });
            });
            context('valid inputs', () => {
                const validResOutput = (editAvailableTimeUsecase) => {
                    const availableTime = editAvailableTimeUsecase.availableTime;
                    (0, chai_1.expect)(availableTime).to.not.deep.equal(fakeAvailableTime);
                };
                it('should edit the available time', async () => {
                    const editAvailableTimeRes = await editAvailableTime();
                    validResOutput(editAvailableTimeRes);
                });
            });
        });
    });
});
