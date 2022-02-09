"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const AbstractEntityValidator_1 = require("../../abstractions/AbstractEntityValidator");
let incomeReportEntityValidator;
let buildParams;
before(() => {
    incomeReportEntityValidator = _1.makeIncomeReportEntityValidator;
});
beforeEach(() => {
    buildParams = {
        revenue: 100,
        wageExpense: -50,
        rentExpense: 0,
        advertisingExpense: 0,
        depreciationExpense: 0,
        suppliesExpense: 0,
        internetExpense: 0,
        startDate: (0, dayjs_1.default)().toDate(),
        endDate: (0, dayjs_1.default)().add(1, 'month').toDate(),
    };
});
describe('incomeReportEntityValidator', () => {
    describe('validate', () => {
        const testValidInputs = (props) => {
            const { validationMode, userRole } = props;
            const validatedObj = incomeReportEntityValidator.validate({
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
                const validatedObj = incomeReportEntityValidator.validate({
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
                context('as a non-admin user', () => {
                    it('should throw an error', () => {
                        testInvalidInputs({
                            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
                            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                        });
                    });
                });
                context('as an admin user', () => {
                    it('should return a valid object', () => {
                        testValidInputs({
                            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
                            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                        });
                    });
                });
            });
            context('edit entity', () => {
                context('as a non-admin user', () => {
                    it('should throw an error', () => {
                        testInvalidInputs({
                            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
                            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                        });
                    });
                });
                context('as an admin user', () => {
                    it('should return a valid object', () => {
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
                    lessonDurations: [30, 30],
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
                    hostedById: 'id',
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
