import { expect } from 'chai';
import { makePackageTransactionParamsValidator } from '.';
import { PackageTransactionParamsValidator } from './packageTransactionParamsValidator';

let packageTransactionParamsValidator: PackageTransactionParamsValidator;
let props: {
  params: {};
};

before(() => {
  packageTransactionParamsValidator = makePackageTransactionParamsValidator;
});

beforeEach(() => {
  props = {
    params: {
      packageTransactionId: '605bc5ad9db900001528f77c',
    },
  };
});

describe('packageTransactionParamsValidator', () => {
  describe('validate', () => {
    const testValidInputs = () => {
      const { params } = props;
      const validatedObj = packageTransactionParamsValidator.validate(props);
      expect(validatedObj).to.deep.equal(params);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = packageTransactionParamsValidator.validate(props);
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
