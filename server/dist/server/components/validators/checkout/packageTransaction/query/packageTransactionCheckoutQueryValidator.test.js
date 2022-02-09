"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let packageTransactionCheckoutQueryValidator;
let query;
before(() => {
    packageTransactionCheckoutQueryValidator = _1.makePackageTransactionCheckoutQueryValidator;
});
beforeEach(() => {
    query = {
        paymentGateway: 'paypal',
    };
});
describe('packageTransactionCheckoutQueryValidator', () => {
    describe('validate', () => {
        const testValidInputs = () => {
            const validatedObj = packageTransactionCheckoutQueryValidator.validate({ query });
            (0, chai_1.expect)(validatedObj).to.deep.equal(query);
            (0, chai_1.expect)(validatedObj).to.not.have.property('error');
        };
        const testInvalidInputs = () => {
            try {
                const validatedObj = packageTransactionCheckoutQueryValidator.validate({ query });
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
                query = {
                    uId: 'some value',
                    maxValue: -5,
                };
                testInvalidInputs();
            });
        });
    });
});
