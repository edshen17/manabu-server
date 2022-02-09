"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let getPackageTransactionsController;
let fakeDbPackageTransactionFactory;
let fakePackageTransaction;
let body;
let currentAPIUser;
let params;
let path;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    getPackageTransactionsController = await _1.makeGetPackageTransactionsController;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
});
beforeEach(async () => {
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    params = {};
    body = {};
    currentAPIUser = {
        role: fakePackageTransaction.hostedByData.role,
        userId: fakePackageTransaction.hostedById,
    };
    path = '';
});
describe('getPackageTransactionsController', () => {
    describe('makeRequest', () => {
        const getPackageTransactions = async () => {
            const getPackageTransactionsHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .path(path)
                .build();
            const getPackageTransactionsRes = await getPackageTransactionsController.makeRequest(getPackageTransactionsHttpRequest);
            return getPackageTransactionsRes;
        };
        const testValidGetPackageTransactions = async () => {
            const getPackageTransactionsRes = await getPackageTransactions();
            (0, chai_1.expect)(getPackageTransactionsRes.statusCode).to.equal(200);
            (0, chai_1.expect)(getPackageTransactionsRes.body).to.have.property('packageTransactions');
        };
        const testInvalidGetPackageTransactions = async () => {
            const getPackageTransactionsRes = await getPackageTransactions();
            (0, chai_1.expect)(getPackageTransactionsRes.statusCode).to.equal(404);
        };
        context('valid inputs', () => {
            context('as a non-admin user', () => {
                context('viewing self', () => {
                    it('should get the packageTransactions for the user', async () => {
                        params = {};
                        path = '/self';
                        await testValidGetPackageTransactions();
                    });
                });
                context('viewing other', () => {
                    it('should throw an error if not package transaction owner', async () => {
                        currentAPIUser.userId = undefined;
                        await testInvalidGetPackageTransactions();
                    });
                });
            });
            context('as an admin', () => {
                it('should get the packageTransactions', async () => {
                    currentAPIUser.role = 'admin';
                    await testValidGetPackageTransactions();
                });
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                params = {
                    packageTransactionId: 'some id',
                };
                await testInvalidGetPackageTransactions();
            });
        });
    });
});
