"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let packageTransactionQueryValidator;
let props;
before(() => {
    packageTransactionQueryValidator = _1.makePackageTransactionQueryValidator;
    props = {
        query: {
            token: 'some good token',
        },
    };
});
describe('packageTransactionQueryValidator', () => {
    describe('validate', () => {
        const testValidInputs = (props) => {
            const { query } = props;
            const validatedObj = packageTransactionQueryValidator.validate(props);
            (0, chai_1.expect)(validatedObj).to.deep.equal(query);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = (props) => {
            try {
                const validatedObj = packageTransactionQueryValidator.validate(props);
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
                props.query.token = 5;
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
