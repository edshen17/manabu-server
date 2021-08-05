import { expect } from 'chai';
import { makeAvailableTimeParamsValidator } from '.';
import { AvailableTimeParamsValidator } from './availableTimeParamsValidator';

let availableTimeParamsValidator: AvailableTimeParamsValidator;
let props: {
  params: {};
};

before(() => {
  availableTimeParamsValidator = makeAvailableTimeParamsValidator;
});

beforeEach(() => {
  props = {
    params: {
      availableTimeId: '605bc5ad9db900001528f77c',
    },
  };
});

describe('availableTimeParamsValidator', () => {
  describe('validate', () => {
    const testValidInputs = () => {
      const { params } = props;
      const validatedObj = availableTimeParamsValidator.validate(props);
      expect(validatedObj).to.deep.equal(params);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = availableTimeParamsValidator.validate(props);
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
