"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const AbstractEntityValidator_1 = require("../../abstractions/AbstractEntityValidator");
let userEntityValidator;
let buildParams;
before(() => {
    userEntityValidator = _1.makeUserEntityValidator;
});
beforeEach(() => {
    buildParams = {
        name: 'some name',
        password: 'Password!2',
        email: 'someEmail@gmail.com',
    };
});
describe('userEntityValidator', () => {
    describe('validate', () => {
        const testValidInputs = (props) => {
            const { validationMode, userRole } = props;
            const validatedObj = userEntityValidator.validate({
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
                const validatedObj = userEntityValidator.validate({
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
                            name: 'new name',
                            password: 'NewPassword!2',
                            email: 'newEmail@gmail.com',
                            profileBio: 'new bio',
                            languages: [{ code: 'ja', level: 'C2' }],
                            settings: {
                                currency: 'SGD',
                                locale: 'en',
                            },
                            region: 'some region',
                            timezone: 'some timezone',
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
                            role: 'teacher',
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
                it('should throw an error', () => {
                    buildParams = {
                        name: 5,
                        password: 'weak password',
                    };
                    testInvalidInputs({
                        validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
                        userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                    });
                });
            });
            context('edit entity', () => {
                context('as a non-admin user', () => {
                    it('should throw an error', () => {
                        buildParams = {
                            verificationToken: 'some token',
                            password: 'weak password',
                            role: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN,
                            dateRegistered: 'new date',
                            nonExistent: 'some field',
                        };
                        testInvalidInputs({
                            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
                            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                        });
                    });
                });
                context('as an admin', () => {
                    it('should throw an error', () => {
                        buildParams = {
                            verificationToken: 'some token',
                            role: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN,
                        };
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
