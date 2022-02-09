"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbPackageTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let getPackageTransactionController;
let fakeDbPackageTransactionFactory;
let fakePackageTransaction;
let body;
let currentAPIUser;
let params;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    getPackageTransactionController = await _1.makeGetPackageTransactionController;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
});
beforeEach(async () => {
    params = {
        packageTransactionId: fakePackageTransaction._id,
    };
    body = {};
    currentAPIUser = {
        role: 'user',
        userId: fakePackageTransaction.reservedById,
    };
});
describe('getPackageTransactionController', () => {
    describe('makeRequest', () => {
        const getPackageTransaction = async () => {
            const getPackageTransactionHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const getPackageTransactionRes = await getPackageTransactionController.makeRequest(getPackageTransactionHttpRequest);
            return getPackageTransactionRes;
        };
        const testValidGetPackageTransaction = async () => {
            const getPackageTransactionRes = await getPackageTransaction();
            (0, chai_1.expect)(getPackageTransactionRes.statusCode).to.equal(200);
            if ('packageTransaction' in getPackageTransactionRes.body) {
                (0, chai_1.expect)(getPackageTransactionRes.body.packageTransaction._id).to.deep.equal(fakePackageTransaction._id);
            }
        };
        const testInvalidGetPackageTransaction = async () => {
            const getPackageTransactionRes = await getPackageTransaction();
            (0, chai_1.expect)(getPackageTransactionRes.statusCode).to.equal(404);
        };
        context('valid inputs', () => {
            context('as a non-admin user', () => {
                context('viewing self', () => {
                    it('should get the packageTransaction for the user (reservedBy)', async () => {
                        await testValidGetPackageTransaction();
                    });
                });
                context('viewing other', () => {
                    it('should throw an error', async () => {
                        currentAPIUser.userId = undefined;
                        await testInvalidGetPackageTransaction();
                    });
                });
            });
            context('as an admin', () => {
                it('should get the packageTransaction', async () => {
                    currentAPIUser.role = 'admin';
                    await testValidGetPackageTransaction();
                });
            });
        });
        context('invalid inputs', () => {
            it('should throw an error if user input is invalid', async () => {
                params = {
                    packageTransactionId: 'some id',
                };
                await testInvalidGetPackageTransaction();
            });
        });
    });
});
