"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let getAppointmentsUsecase;
let controllerDataBuilder;
let routeData;
let currentAPIUser;
let fakeDbAppointmentFactory;
let fakeDbPackageTransactionFactory;
let fakePackageTransaction;
let fakeAppointment;
before(async () => {
    getAppointmentsUsecase = await _1.makeGetAppointmentsUsecase;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    fakeDbAppointmentFactory = await fakeDbAppointmentFactory_1.makeFakeDbAppointmentFactory;
});
beforeEach(async () => {
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
        hostedById: fakePackageTransaction.hostedById,
        reservedById: fakePackageTransaction.reservedById,
        packageTransactionId: fakePackageTransaction._id,
        startDate: fakePackageTransaction.createdDate,
        endDate: fakePackageTransaction.terminationDate,
    });
    routeData = {
        params: {
            userId: fakePackageTransaction.hostedById,
        },
        body: {},
        query: {
            startDate: fakePackageTransaction.createdDate,
            endDate: fakePackageTransaction.terminationDate,
        },
        endpointPath: '',
        headers: {},
        rawBody: {},
    };
    currentAPIUser = {
        userId: fakePackageTransaction.reservedById,
        role: 'user',
    };
});
describe('getAppointmentsUsecase', () => {
    describe('makeRequest', () => {
        const getAppointments = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const getAppointmentsRes = await getAppointmentsUsecase.makeRequest(controllerData);
            const appointments = getAppointmentsRes.appointments;
            return appointments;
        };
        const testAppointmentView = (props) => {
            const { isSelf, appointments } = props;
            const firstAppointment = appointments[0];
            if (isSelf) {
                (0, chai_1.expect)(firstAppointment).to.have.property('packageTransactionId');
                (0, chai_1.expect)(firstAppointment).to.have.property('reservedById');
            }
            else {
                (0, chai_1.expect)(firstAppointment).to.not.have.property('packageTransactionId');
                (0, chai_1.expect)(firstAppointment).to.not.have.property('cancellationReason');
                (0, chai_1.expect)(firstAppointment).to.not.have.property('reservedById');
            }
        };
        const testAppointmentError = async () => {
            let error;
            try {
                error = await getAppointments();
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
                    await testAppointmentError();
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it("should get the user's appointments for the week", async () => {
                            routeData.params = {};
                            routeData.endpointPath = '/self';
                            const appointments = await getAppointments();
                            testAppointmentView({ isSelf: true, appointments });
                        });
                    });
                    context('viewing other', () => {
                        it("should get a restricted view of the user's appointments for the week", async () => {
                            const appointments = await getAppointments();
                            testAppointmentView({ isSelf: false, appointments });
                        });
                    });
                    context('as an unlogged-in user', async () => {
                        it("should get a restricted view of the user's appointments for the week", async () => {
                            currentAPIUser = { role: 'user', userId: undefined };
                            const appointments = await getAppointments();
                            testAppointmentView({ isSelf: false, appointments });
                        });
                    });
                });
                context('as an admin', () => {
                    context('viewing other', () => {
                        it("should get the user's appointments for the week", async () => {
                            currentAPIUser.userId = undefined;
                            currentAPIUser.role = 'admin';
                            const appointments = await getAppointments();
                            testAppointmentView({ isSelf: true, appointments });
                        });
                    });
                });
            });
        });
    });
});
