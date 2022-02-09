"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const AbstractEntityValidator_1 = require("../../../abstractions/AbstractEntityValidator");
let packageTransactionCheckoutEntityValidator;
let buildParams;
before(() => {
    packageTransactionCheckoutEntityValidator = _1.makePackageTransactionCheckoutEntityValidator;
});
beforeEach(() => {
    buildParams = {
        teacherId: '5d6ede6a0ba62570afcedd3a',
        packageId: '5d6ede6a0ba62570afcedd3a',
    };
});
describe('packageTransactionCheckoutEntityValidator', () => {
    describe('validate', () => {
        const testValidInputs = (props) => {
            const { validationMode, userRole } = props;
            const validatedObj = packageTransactionCheckoutEntityValidator.validate({
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
                const validatedObj = packageTransactionCheckoutEntityValidator.validate({
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
                    hostedBy: '5d6ede6a0ba62570afssscedd3a',
                    reservedBy: '5d6ede6a0ba62570afasdcedd3a',
                    hostedByData: '5d6ede6a0ba62570afcsaddedd3a',
                };
                it('should throw an error', () => {
                    testInvalidInputs({
                        validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
                        userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                    });
                });
            });
        });
    });
});
