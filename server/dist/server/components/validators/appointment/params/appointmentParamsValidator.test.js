"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let appointmentParamsValidator;
let props;
before(() => {
    appointmentParamsValidator = _1.makeAppointmentParamsValidator;
});
beforeEach(() => {
    props = {
        params: {
            appointmentId: '605bc5ad9db900001528f77c',
        },
    };
});
describe('appointmentParamsValidator', () => {
    describe('validate', () => {
        const testValidInputs = () => {
            const { params } = props;
            const validatedObj = appointmentParamsValidator.validate(props);
            (0, chai_1.expect)(validatedObj).to.deep.equal(params);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = () => {
            try {
                const validatedObj = appointmentParamsValidator.validate(props);
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
                    appointmentId: 'some value',
                };
                testInvalidInputs();
            });
        });
    });
});
