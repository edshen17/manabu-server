"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let editAppointmentController;
let fakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory;
let fakePackageTransaction;
let fakeAppointment;
let body;
let currentAPIUser;
let params;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    editAppointmentController = await _1.makeEditAppointmentController;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    fakeDbAppointmentFactory = await fakeDbAppointmentFactory_1.makeFakeDbAppointmentFactory;
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
        hostedById: fakePackageTransaction.hostedById,
        reservedById: fakePackageTransaction.reservedById,
        packageTransactionId: fakePackageTransaction._id,
        startDate: fakePackageTransaction.createdDate,
        endDate: fakePackageTransaction.terminationDate,
    });
});
beforeEach(async () => {
    params = {
        appointmentId: fakeAppointment._id,
    };
    body = {
        startDate: new Date(),
        status: 'cancelled',
    };
    currentAPIUser = {
        role: 'user',
        userId: fakePackageTransaction.hostedById,
    };
});
describe('editAppointmentController', () => {
    describe('makeRequest', () => {
        const editAppointment = async () => {
            const editAppointmentHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const editAppointmentRes = await editAppointmentController.makeRequest(editAppointmentHttpRequest);
            return editAppointmentRes;
        };
        context('valid inputs', () => {
            it('should edit the appointment document', async () => {
                const editAppointmentRes = await editAppointment();
                (0, chai_1.expect)(editAppointmentRes.statusCode).to.equal(200);
                if ('appointment' in editAppointmentRes.body) {
                    (0, chai_1.expect)(editAppointmentRes.body.appointment.status).to.equal('cancelled');
                }
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                params = {};
                const editAppointmentRes = await editAppointment();
                (0, chai_1.expect)(editAppointmentRes.statusCode).to.equal(401);
            });
            it('should throw an error if user does not have access to the resource', async () => {
                params = {
                    appointmentId: '507f191e810c19729de860ea',
                };
                const editAppointmentRes = await editAppointment();
                (0, chai_1.expect)(editAppointmentRes.statusCode).to.equal(401);
            });
            it('should throw an error if the user is not logged in', async () => {
                currentAPIUser.userId = undefined;
                const editAppointmentRes = await editAppointment();
                (0, chai_1.expect)(editAppointmentRes.statusCode).to.equal(401);
            });
        });
    });
});
