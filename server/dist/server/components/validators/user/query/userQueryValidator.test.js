"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let userQueryValidator;
let props;
before(() => {
    userQueryValidator = _1.makeUserQueryValidator;
    props = {
        query: {
            state: {
                redirectUserId: '605bc5ad9db900001528f77c',
                isTeacherApp: true,
            },
        },
    };
});
describe('userQueryValidator', () => {
    describe('validate', () => {
        const testValidInputs = (props) => {
            const { query } = props;
            const validatedObj = userQueryValidator.validate(props);
            (0, chai_1.expect)(validatedObj).to.deep.equal(query);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = (props) => {
            try {
                const validatedObj = userQueryValidator.validate(props);
            }
            catch (err) {
                (0, chai_1.expect)(err).be.an('error');
            }
        };
        context('valid inputs', () => {
            it('should return a valid object', () => {
                testValidInputs(props);
            });
        });
        context('invalid inputs', () => {
            it('should throw an error', () => {
                props.query = {
                    someField: 'some value',
                };
                testInvalidInputs(props);
            });
            it('should throw an error', () => {
                props.query = {
                    uId: 'some value',
                };
                testInvalidInputs(props);
            });
        });
    });
});
