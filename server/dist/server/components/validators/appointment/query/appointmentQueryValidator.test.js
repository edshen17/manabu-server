"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let appointmentQueryValidator;
let query;
before(() => {
    appointmentQueryValidator = _1.makeAppointmentQueryValidator;
});
beforeEach(() => {
    query = {
        startDate: new Date(),
        endDate: new Date(),
    };
});
describe('appointmentQueryValidator', () => {
    describe('validate', () => {
        const testValidInputs = () => {
            const validatedObj = appointmentQueryValidator.validate({ query });
            (0, chai_1.expect)(validatedObj).to.deep.equal(query);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = () => {
            try {
                const validatedObj = appointmentQueryValidator.validate({ query });
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
                query.startDate = 'some date';
                testInvalidInputs();
            });
        });
    });
});
