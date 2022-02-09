"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let getAppointmentUsecase;
let controllerDataBuilder;
let routeData;
let currentAPIUser;
let fakeDbAppointmentFactory;
let fakeDbPackageTransactionFactory;
let fakePackageTransaction;
let fakeAppointment;
before(async () => {
    getAppointmentUsecase = await _1.makeGetAppointmentUsecase;
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
            appointmentId: fakeAppointment._id,
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
describe('getAppointmentUsecase', () => {
    describe('makeRequest', () => {
        const getAppointment = async () => {
            const controllerData = controllerDataBuilder
                .currentAPIUser(currentAPIUser)
                .routeData(routeData)
                .build();
            const getAppointmentRes = await getAppointmentUsecase.makeRequest(controllerData);
            const appointment = getAppointmentRes.appointment;
            return appointment;
        };
        const testAppointmentView = (props) => {
            const { isSelf, appointment } = props;
            if (isSelf) {
                (0, chai_1.expect)(appointment).to.have.property('packageTransactionId');
                (0, chai_1.expect)(appointment).to.have.property('reservedById');
            }
            else {
                (0, chai_1.expect)(appointment).to.not.have.property('packageTransactionId');
                (0, chai_1.expect)(appointment).to.not.have.property('cancellationReason');
                (0, chai_1.expect)(appointment).to.not.have.property('reservedById');
            }
        };
        const testAppointmentError = async () => {
            let error;
            try {
                error = await getAppointment();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if an invalid id is given', async () => {
                    routeData.params = {};
                    await testAppointmentError();
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it('should get an unrestricted view of the appointment (reservedBy)', async () => {
                            const appointment = await getAppointment();
                            testAppointmentView({ isSelf: true, appointment });
                        });
                        it('should get an unrestricted view of the appointment (hostedBy)', async () => {
                            currentAPIUser.userId = fakeAppointment.hostedById;
                            const appointment = await getAppointment();
                            testAppointmentView({ isSelf: true, appointment });
                        });
                    });
                    context('viewing other', () => {
                        it('should throw an error', async () => {
                            currentAPIUser.userId = undefined;
                            await testAppointmentError();
                        });
                    });
                });
                context('as an admin', () => {
                    context('viewing other', () => {
                        it('should get an unrestricted view of the appointment', async () => {
                            currentAPIUser.userId = undefined;
                            currentAPIUser.role = 'admin';
                            const appointment = await getAppointment();
                            testAppointmentView({ isSelf: true, appointment });
                        });
                    });
                });
            });
        });
    });
});
