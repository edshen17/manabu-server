import { expect } from 'chai';
import { makeBaseParamsValidator } from '.';
import { BaseParamsValidator } from './baseParamsValidator';

let baseParamsValidator: BaseParamsValidator;
let props: {
  params: {};
};

before(() => {
  baseParamsValidator = makeBaseParamsValidator;
  props = {
    params: {
      uId: '605bc5ad9db900001528f77c',
    },
  };
});

describe('baseParamsValidator', () => {
  describe('validate', () => {
    const testValidate = (props: { params: {} }) => {
      const { params } = props;
      try {
        const validatedObj = baseParamsValidator.validate(props);
        expect(validatedObj).to.deep.equal(params);
        expect(validatedObj).to.not.have.property('error');
      } catch (err) {
        expect(err).be.an('error');
      }
    };
    context('valid inputs', () => {
      it('should return an empty object', () => {
        testValidate(props);
      });
    });
    context('invalid inputs', () => {
      it('should throw an error', () => {
        props.params = {
          someField: 'some value',
        };
        testValidate(props);
      });
      it('should throw an error', () => {
        props.params = {
          uId: 'some value',
        };
        testValidate(props);
      });
    });
  });
});
