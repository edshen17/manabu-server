"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let getAppointmentsController;
let fakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory;
let fakePackageTransaction;
let fakeAppointment;
let body;
let currentAPIUser;
let params;
let path;
let query;
let queryStringHandler;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    getAppointmentsController = await _1.makeGetAppointmentsController;
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
    queryStringHandler = queryStringHandler_1.makeQueryStringHandler;
});
beforeEach(async () => {
    params = {
        userId: fakePackageTransaction.hostedById,
    };
    body = {};
    currentAPIUser = {
        role: 'user',
        userId: fakePackageTransaction.reservedById,
    };
    const filter = queryStringHandler.encodeQueryStringObj({
        startDate: fakePackageTransaction.createdDate,
        endDate: fakePackageTransaction.terminationDate,
    });
    query = queryStringHandler.parseQueryString(filter);
    path = '';
});
describe('getAppointmentsController', () => {
    describe('makeRequest', () => {
        const getAppointments = async () => {
            const getAppointmentsHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .query(query)
                .path(path)
                .build();
            const getAppointmentsRes = await getAppointmentsController.makeRequest(getAppointmentsHttpRequest);
            return getAppointmentsRes;
        };
        const testValidGetAppointments = async () => {
            const getAppointmentsRes = await getAppointments();
            (0, chai_1.expect)(getAppointmentsRes.statusCode).to.equal(200);
            if ('appointments' in getAppointmentsRes.body) {
                (0, chai_1.expect)(getAppointmentsRes.body.appointments.length).to.deep.equal([fakeAppointment].length);
            }
        };
        const testInvalidGetAppointments = async () => {
            const getAppointmentsRes = await getAppointments();
            (0, chai_1.expect)(getAppointmentsRes.statusCode).to.equal(404);
        };
        context('valid inputs', () => {
            context('as a non-admin user', () => {
                context('viewing self', () => {
                    it('should get the appointments for the user', async () => {
                        params = {};
                        path = '/self';
                        await testValidGetAppointments();
                    });
                });
                context('viewing other', () => {
                    it('should get the appointments', async () => {
                        currentAPIUser.userId = undefined;
                        const getAppointmentsRes = await getAppointments();
                        await testValidGetAppointments();
                    });
                });
            });
            context('as an admin', () => {
                it('should get the appointments', async () => {
                    currentAPIUser.role = 'admin';
                    await testValidGetAppointments();
                });
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                params = {
                    userId: 'some id',
                };
                await testInvalidGetAppointments();
            });
        });
    });
});
