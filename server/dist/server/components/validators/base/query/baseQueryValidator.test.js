"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let baseQueryValidator;
const props = {
    query: {},
};
before(() => {
    baseQueryValidator = _1.makeBaseQueryValidator;
    props.query = {};
});
describe('baseQueryValidator', () => {
    describe('validate', () => {
        const testValidInputs = (props) => {
            const { query } = props;
            const validatedObj = baseQueryValidator.validate(props);
            (0, chai_1.expect)(validatedObj).to.deep.equal(query);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = (props) => {
            try {
                const validatedObj = baseQueryValidator.validate(props);
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
                props.query = {
                    someField: 'some value',
                };
                testInvalidInputs(props);
            });
        });
    });
});
