"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const faker_1 = __importDefault(require("faker"));
const _1 = require(".");
const AbstractEntityValidator_1 = require("../../abstractions/AbstractEntityValidator");
let teacherEntityValidator;
let buildParams;
before(() => {
    teacherEntityValidator = _1.makeTeacherEntityValidator;
});
beforeEach(() => {
    buildParams = {};
});
describe('teacherEntityValidator', () => {
    describe('validate', () => {
        const testValidInputs = (props) => {
            const { validationMode, userRole } = props;
            const validatedObj = teacherEntityValidator.validate({
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
                const validatedObj = teacherEntityValidator.validate({
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
                            priceData: {
                                hourlyRate: 35,
                                currency: 'SGD',
                            },
                            licenseUrl: faker_1.default.image.dataUri(),
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
                            applicationStatus: 'approved',
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
                    userId: '5d6ede6asdasdadas0ba62570afcedd3a',
                    balanceDetails: {
                        balance: '0',
                        currency: 'SGDDDDD',
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
                    userId: '5d6ede6a0ba62570afcedd3a',
                    teacherType: 'professional',
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
                            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN,
                        });
                    });
                });
            });
        });
    });
});
