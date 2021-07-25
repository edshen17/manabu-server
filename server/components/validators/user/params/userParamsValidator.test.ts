import { expect } from 'chai';
import { makeUserParamsValidator } from '.';
import { UserParamsValidator } from './userParamsValidator';

let userParamsValidator: UserParamsValidator;
let props: {
  params: {};
};

before(() => {
  userParamsValidator = makeUserParamsValidator;
  props = {
    params: {
      userId: '605bc5ad9db900001528f77c',
    },
  };
});

describe('userParamsValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { params: {} }) => {
      const { params } = props;
      const validatedObj = userParamsValidator.validate(props);
      expect(validatedObj).to.deep.equal(params);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = (props: { params: {} }) => {
      const { params } = props;
      try {
        const validatedObj = userParamsValidator.validate(props);
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
        props.params = {
          someField: 'some value',
        };
        testInvalidInputs(props);
      });
      it('should throw an error', () => {
        props.params = {
          userId: 'some value',
        };
        testInvalidInputs(props);
      });
    });
  });
});
