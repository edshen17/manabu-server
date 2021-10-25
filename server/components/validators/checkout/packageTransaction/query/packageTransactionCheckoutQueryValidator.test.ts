import { expect } from 'chai';
import { makePackageTransactionCheckoutQueryValidator } from '.';
import { StringKeyObject } from '../../../../../types/custom';
import { PackageTransactionCheckoutQueryValidator } from './packageTransactionCheckoutQueryValidator';

let packageTransactionCheckoutQueryValidator: PackageTransactionCheckoutQueryValidator;
let query: StringKeyObject;

before(() => {
  packageTransactionCheckoutQueryValidator = makePackageTransactionCheckoutQueryValidator;
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
      expect(validatedObj).to.deep.equal(query);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = packageTransactionCheckoutQueryValidator.validate({ query });
      } catch (err) {
        expect(err).be.an('error');
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
