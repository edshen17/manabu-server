"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbAvailableTimeFactory;
let deleteAvailableTimeUsecase;
let routeData;
let currentAPIUser;
let fakeAvailableTime;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    deleteAvailableTimeUsecase = await _1.makeDeleteAvailableTimeUsecase;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
});
beforeEach(async () => {
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
    routeData = {
        headers: {},
        params: {
            availableTimeId: fakeAvailableTime._id,
        },
        body: {},
        query: {},
        endpointPath: '',
        rawBody: {},
    };
    currentAPIUser = {
        role: 'user',
        userId: fakeAvailableTime.hostedById,
    };
});
describe('deleteAvailableTimeUsecase', () => {
    describe('makeRequest', () => {
        const deleteAvailableTime = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const deleteAvailableTimeUsecaseRes = await deleteAvailableTimeUsecase.makeRequest(controllerData);
            return deleteAvailableTimeUsecaseRes;
        };
        const testAvailableTimeError = async () => {
            let error;
            try {
                await deleteAvailableTime();
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
            });
            context('valid inputs', () => {
                const validResOutput = (deleteAvailableTimeUsecase) => {
                    const availableTime = deleteAvailableTimeUsecase.availableTime;
                    (0, chai_1.expect)(availableTime).to.deep.equal(fakeAvailableTime);
                };
                it('should return a new available time', async () => {
                    const deleteAvailableTimeRes = await deleteAvailableTime();
                    validResOutput(deleteAvailableTimeRes);
                });
            });
        });
    });
});
