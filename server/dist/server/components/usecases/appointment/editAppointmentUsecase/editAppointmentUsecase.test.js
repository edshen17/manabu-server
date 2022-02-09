"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let fakeDbAppointmentFactory;
let fakeDbPackageTransactionFactory;
let editAppointmentUsecase;
let routeData;
let currentAPIUser;
let fakePackageTransaction;
let fakeAppointment;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    editAppointmentUsecase = await _1.makeEditAppointmentUsecase;
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
        body: {
            status: 'confirmed',
        },
        query: {},
        endpointPath: '',
        headers: {},
        rawBody: {},
    };
    currentAPIUser = {
        role: 'teacher',
        userId: fakePackageTransaction.hostedById,
    };
});
describe('editAppointmentUsecase', () => {
    describe('makeRequest', () => {
        const editAppointment = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const editAppointmentRes = await editAppointmentUsecase.makeRequest(controllerData);
            const editedAppointment = editAppointmentRes.appointment;
            return editedAppointment;
        };
        const testAppointmentView = (props) => {
            const { isSelf, appointment } = props;
            if (isSelf) {
                (0, chai_1.expect)(appointment).to.have.property('packageTransactionId');
                (0, chai_1.expect)(appointment).to.have.property('reservedById');
            }
            else {
                (0, chai_1.expect)(appointment).to.not.have.property('packageTransactionId');
                (0, chai_1.expect)(appointment).to.not.have.property('reservedById');
            }
        };
        const testAppointmentError = async () => {
            let error;
            try {
                await editAppointment();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if an invalid id is given', async () => {
                    routeData.body = {
                        hostedById: 'some id',
                        packageTransactionData: {},
                        createdDate: new Date(),
                    };
                    await testAppointmentError();
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('editing self', () => {
                        it('should edit the appointment and return an unrestricted view of the appointment (reservedBy)', async () => {
                            currentAPIUser.userId = fakeAppointment.reservedById;
                            routeData.body = { status: 'student cancel' };
                            await testAppointmentError();
                        });
                        it('should edit the appointment and return an unrestricted view of the appointment (hostedBy)', async () => {
                            const appointment = await editAppointment();
                            testAppointmentView({ isSelf: true, appointment });
                        });
                        it('should throw error if reservedBy changes status to something other than cancel', async () => {
                            currentAPIUser.userId = fakeAppointment.reservedById;
                            await testAppointmentError();
                        });
                    });
                    context('editing other', () => {
                        it('should throw an error', async () => {
                            currentAPIUser = { role: 'user', userId: undefined };
                            await testAppointmentError();
                        });
                    });
                });
                context('as an admin', () => {
                    context('viewing other', () => {
                        it('should get an unrestricted view of the appointment', async () => {
                            currentAPIUser.userId = undefined;
                            currentAPIUser.role = 'admin';
                            const appointment = await editAppointment();
                            testAppointmentView({ isSelf: true, appointment });
                        });
                    });
                });
            });
        });
    });
});
