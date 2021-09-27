import { expect } from 'chai';
import { makePackageParamsValidator } from '.';
import { PackageParamsValidator } from './packageParamsValidator';

let packageParamsValidator: PackageParamsValidator;
let props: {
  params: {};
};

before(() => {
  packageParamsValidator = makePackageParamsValidator;
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
      expect(validatedObj).to.deep.equal(params);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = packageParamsValidator.validate(props);
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
          availableTimeId: 'some value',
        };
        testInvalidInputs();
      });
    });
  });
});
