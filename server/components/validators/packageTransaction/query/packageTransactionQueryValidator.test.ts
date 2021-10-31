import { expect } from 'chai';
import { makePackageTransactionQueryValidator } from '.';
import { StringKeyObject } from '../../../../types/custom';
import { PackageTransactionQueryValidator } from './packageTransactionQueryValidator';

let packageTransactionQueryValidator: PackageTransactionQueryValidator;
let props: {
  query: StringKeyObject;
};

before(() => {
  packageTransactionQueryValidator = makePackageTransactionQueryValidator;
  props = {
    query: {
      token: 'some good token',
    },
  };
});

describe('packageTransactionQueryValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { query: {} }) => {
      const { query } = props;
      const validatedObj = packageTransactionQueryValidator.validate(props);
      expect(validatedObj).to.deep.equal(query);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = (props: { query: {} }) => {
      try {
        const validatedObj = packageTransactionQueryValidator.validate(props);
      } catch (err) {
        expect(err).be.an('error');
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
