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
    params: {},
  };
});

describe('baseParamsValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { params: {} }) => {
      const { params } = props;
      const validatedObj = baseParamsValidator.validate(props);
      expect(validatedObj).to.deep.equal(params);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = (props: { params: {} }) => {
      try {
        const validatedObj = baseParamsValidator.validate(props);
      } catch (err) {
        expect(err).be.an('error');
      }
    };
    context('valid inputs', () => {
      it('should return an empty object', () => {
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
          uId: 'some value',
        };
        testInvalidInputs(props);
      });
    });
  });
});
