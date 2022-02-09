"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let getAvailableTimesUsecase;
let controllerDataBuilder;
let routeData;
let currentAPIUser;
let fakeAvailableTime;
let fakeDbAvailableTimeFactory;
before(async () => {
    getAvailableTimesUsecase = await _1.makeGetAvailableTimesUsecase;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
});
beforeEach(async () => {
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
    routeData = {
        rawBody: {},
        headers: {},
        params: {
            userId: fakeAvailableTime.hostedById,
        },
        body: {},
        query: {},
        endpointPath: '',
    };
    currentAPIUser = {
        userId: fakeAvailableTime.hostedById,
        role: 'user',
    };
});
describe('getAvailableTimesUsecase', () => {
    describe('makeRequest', () => {
        const getAvailableTimes = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const getAvailableTimesRes = await getAvailableTimesUsecase.makeRequest(controllerData);
            const availableTimes = getAvailableTimesRes.availableTimes;
            (0, chai_1.expect)(availableTimes).to.be.an('array');
        };
        const testAvailableTimeError = async () => {
            let error;
            try {
                await getAvailableTimes();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if an invalid id is given', async () => {
                    routeData.params = {
                        userId: 'some id',
                    };
                    await testAvailableTimeError();
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it("should get the user's available times", async () => {
                            routeData.endpointPath = '/self';
                            routeData.params = {};
                            await getAvailableTimes();
                        });
                    });
                    context('viewing other', () => {
                        it('should get the available times', async () => {
                            currentAPIUser.userId = undefined;
                            await getAvailableTimes();
                        });
                    });
                });
                context('as an admin', () => {
                    context('viewing other', () => {
                        it('should get the available times', async () => {
                            currentAPIUser.userId = undefined;
                            currentAPIUser.role = 'admin';
                            await getAvailableTimes();
                        });
                    });
                });
                context('as an unlogged-in user', async () => {
                    it('should get the available times', async () => {
                        currentAPIUser = { role: 'user', userId: undefined };
                        await getAvailableTimes();
                    });
                });
            });
        });
    });
});
