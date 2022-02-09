"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let baseParamsValidator;
let props;
before(() => {
    baseParamsValidator = _1.makeBaseParamsValidator;
    props = {
        params: {},
    };
});
describe('baseParamsValidator', () => {
    describe('validate', () => {
        const testValidInputs = (props) => {
            const { params } = props;
            const validatedObj = baseParamsValidator.validate(props);
            (0, chai_1.expect)(validatedObj).to.deep.equal(params);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = (props) => {
            try {
                const validatedObj = baseParamsValidator.validate(props);
            }
            catch (err) {
                (0, chai_1.expect)(err).be.an('error');
            }
        };
        context('valid inputs', () => {
            it('should return an empty object', () => {
                testValidInputs(props);
            });
        });
        context('invalid inputs', () => {
            it('should throw an error', () => {
                props.params = {
                    someField: 'some value',
                };
                testInvalidInputs(props);
            });
            it('should throw an error', () => {
                props.params = {
                    userId: 'some value',
                };
                testInvalidInputs(props);
            });
        });
    });
});
