"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let packageParamsValidator;
let props;
before(() => {
    packageParamsValidator = _1.makePackageParamsValidator;
});
beforeEach(() => {
    props = {
        params: {
            packageId: '605bc5ad9db900001528f77c',
        },
    };
});
describe('packageParamsValidator', () => {
    describe('validate', () => {
        const testValidInputs = () => {
            const { params } = props;
            const validatedObj = packageParamsValidator.validate(props);
            (0, chai_1.expect)(validatedObj).to.deep.equal(params);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = () => {
            try {
                const validatedObj = packageParamsValidator.validate(props);
            }
            catch (err) {
                (0, chai_1.expect)(err).be.an('error');
            }
        };
        context('valid inputs', () => {
            it('should return a valid object', () => {
                testValidInputs();
            });
        });
        context('invalid inputs', () => {
            it('should throw an error', () => {
                props.params = {
                    someField: 'some value',
                };
                testInvalidInputs();
            });
            it('should throw an error', () => {
                props.params = {
                    availableTimeId: 'some value',
                };
                testInvalidInputs();
            });
        });
    });
});
