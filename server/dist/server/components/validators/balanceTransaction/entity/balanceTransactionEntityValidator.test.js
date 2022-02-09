"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const balanceTransactionEntity_1 = require("../../../entities/balanceTransaction/balanceTransactionEntity");
const AbstractEntityValidator_1 = require("../../abstractions/AbstractEntityValidator");
let balanceTransactionEntityValidator;
let buildParams;
before(() => {
    balanceTransactionEntityValidator = _1.makeBalanceTransactionEntityValidator;
});
beforeEach(() => {
    buildParams = {
        userId: '5d6ede6a0ba62570afcedd3a',
        status: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_STATUS.PENDING,
        currency: 'SGD',
        type: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
        packageTransactionId: undefined,
        balanceChange: 100,
        processingFee: 5,
        tax: 0.2,
        totalPayment: 105.2,
        runningBalance: {
            currency: 'SGD',
            totalAvailable: 0,
        },
        paymentData: {
            gateway: 'paypal',
            id: 'some id',
        },
    };
});
describe('balanceTransactionEntityValidator', () => {
    describe('validate', () => {
        const testValidInputs = (props) => {
            const { validationMode, userRole } = props;
            const validatedObj = balanceTransactionEntityValidator.validate({
                validationMode: validationMode,
                userRole,
                buildParams,
            });
            (0, chai_1.expect)(validatedObj).to.deep.equal(buildParams);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = (props) => {
            const { validationMode, userRole } = props;
            try {
                const validatedObj = balanceTransactionEntityValidator.validate({
                    validationMode: validationMode,
                    userRole,
                    buildParams,
                });
            }
            catch (err) {
                (0, chai_1.expect)(err).be.an('error');
            }
        };
        context('valid inputs', () => {
            context('create entity', () => {
                it('should return a valid object', () => {
                    testValidInputs({
                        validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
                        userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                    });
                });
            });
        });
        context('invalid inputs', () => {
            context('create entity', () => {
                buildParams = {
                    userId: '5d6ede6a0ba62570afssscedd3a',
                    runningBalance: {
                        totalAvailable: -10,
                        currency: 'SGD',
                    },
                };
                it('should throw an error', () => {
                    testInvalidInputs({
                        validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
                        userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                    });
                });
            });
            context('edit entity', () => {
                buildParams = {
                    userId: 2,
                };
                context('as a non-admin user', () => {
                    it('should throw an error', () => {
                        testInvalidInputs({
                            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
                            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                        });
                    });
                });
                context('as an admin', () => {
                    it('should throw an error', () => {
                        testInvalidInputs({
                            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
                            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                        });
                    });
                });
            });
        });
    });
});
