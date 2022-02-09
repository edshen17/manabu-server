"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const AbstractEntityValidator_1 = require("../../abstractions/AbstractEntityValidator");
let appointmentEntityValidator;
let buildParams;
before(() => {
    appointmentEntityValidator = _1.makeAppointmentEntityValidator;
});
beforeEach(() => {
    buildParams = {
        hostedById: '5d6ede6a0ba62570afcedd3a',
        reservedById: '5d6ede6a0ba62570afcedd3a',
        packageTransactionId: '5d6ede6a0ba62570afcedd3a',
        startDate: new Date(),
        endDate: new Date(),
    };
});
describe('appointmentEntityValidator', () => {
    describe('validate', () => {
        const testValidInputs = (props) => {
            const { validationMode, userRole } = props;
            const validatedObj = appointmentEntityValidator.validate({
                validationMode: validationMode,
                userRole,
                buildParams,
            });
            (0, chai_1.expect)(validatedObj).to.deep.equal(buildParams);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = (props) => {
            try {
                const { validationMode, userRole } = props;
                const validatedObj = appointmentEntityValidator.validate({
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
            context('edit entity', () => {
                context('as a non-admin user', () => {
                    it('should return a valid object', () => {
                        buildParams = {
                            status: 'cancelled',
                            cancellationReason: 'student cancel',
                        };
                        testValidInputs({
                            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
                            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                        });
                    });
                });
                context('as an admin', () => {
                    it('should return a valid object', () => {
                        buildParams = {
                            status: 'cancelled',
                            cancellationReason: 'student cancel',
                        };
                        testValidInputs({
                            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
                            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN,
                        });
                    });
                });
            });
        });
        context('invalid inputs', () => {
            context('create entity', () => {
                buildParams = {
                    hostedById: 5,
                };
                it('should throw an error', () => {
                    testInvalidInputs({
                        validationMode: 'create',
                        userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                    });
                });
            });
            context('edit entity', () => {
                context('as a non-admin user', () => {
                    it('should throw an error', () => {
                        buildParams = {
                            hostedById: 'some id',
                        };
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
                            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN,
                        });
                    });
                });
            });
        });
    });
});
