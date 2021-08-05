import { expect } from 'chai';
import { makeUserParamsValidator } from '.';
import { UserParamsValidator } from './userParamsValidator';

let userParamsValidator: UserParamsValidator;
let props: {
  params: {};
};

before(() => {
  userParamsValidator = makeUserParamsValidator;
});

beforeEach(() => {
  props = {
    params: {
      userId: '605bc5ad9db900001528f77c',
    },
  };
});

describe('userParamsValidator', () => {
  describe('validate', () => {
    const testValidInputs = () => {
      const { params } = props;
      const validatedObj = userParamsValidator.validate(props);
      expect(validatedObj).to.deep.equal(params);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = userParamsValidator.validate(props);
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
          userId: 'some value',
        };
        testInvalidInputs();
      });
    });
  });
});
