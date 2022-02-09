"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let getAppointmentController;
let fakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory;
let fakePackageTransaction;
let fakeAppointment;
let body;
let currentAPIUser;
let params;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    getAppointmentController = await _1.makeGetAppointmentController;
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
    body = {};
    currentAPIUser = {
        role: 'user',
        userId: fakePackageTransaction.reservedById,
    };
});
describe('getAppointmentController', () => {
    describe('makeRequest', () => {
        const getAppointment = async () => {
            const getAppointmentHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const getAppointmentRes = await getAppointmentController.makeRequest(getAppointmentHttpRequest);
            return getAppointmentRes;
        };
        const testValidGetAppointment = async () => {
            const getAppointmentRes = await getAppointment();
            (0, chai_1.expect)(getAppointmentRes.statusCode).to.equal(200);
            if ('appointment' in getAppointmentRes.body) {
                (0, chai_1.expect)(getAppointmentRes.body.appointment._id).to.deep.equal(fakeAppointment._id);
            }
        };
        const testInvalidGetAppointment = async () => {
            const getAppointmentRes = await getAppointment();
            (0, chai_1.expect)(getAppointmentRes.statusCode).to.equal(404);
        };
        context('valid inputs', () => {
            context('as a non-admin user', () => {
                context('viewing self', () => {
                    it('should get the appointment for the user (reservedBy)', async () => {
                        await testValidGetAppointment();
                    });
                });
                context('viewing other', () => {
                    it('should throw an error', async () => {
                        currentAPIUser.userId = undefined;
                        await testInvalidGetAppointment();
                    });
                });
            });
            context('as an admin', () => {
                it('should get the appointment', async () => {
                    currentAPIUser.role = 'admin';
                    await testValidGetAppointment();
                });
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                params = {
                    appointmentId: 'some id',
                };
                await testInvalidGetAppointment();
            });
        });
    });
});
