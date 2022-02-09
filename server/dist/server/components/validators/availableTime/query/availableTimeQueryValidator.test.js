"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let availableTimeQueryValidator;
let query;
before(() => {
    availableTimeQueryValidator = _1.makeAvailableTimeQueryValidator;
});
beforeEach(() => {
    query = {
        startDate: new Date(),
        endDate: new Date(),
    };
});
describe('availableTimeQueryValidator', () => {
    describe('validate', () => {
        const testValidInputs = () => {
            const validatedObj = availableTimeQueryValidator.validate({ query });
            (0, chai_1.expect)(validatedObj).to.deep.equal(query);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = () => {
            try {
                const validatedObj = availableTimeQueryValidator.validate({ query });
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
