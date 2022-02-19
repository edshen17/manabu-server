import { expect } from 'chai';
import { makeWordParamsValidator } from '.';
import { WordParamsValidator } from './wordParamsValidator';

let wordParamsValidator: WordParamsValidator;
let props: {
  params: {};
};

before(() => {
  wordParamsValidator = makeWordParamsValidator;
});

beforeEach(() => {
  props = {
    params: {
      word: 'こんにちは hi',
    },
  };
});

describe('wordParamsValidator', () => {
  describe('validate', () => {
    const testValidInputs = () => {
      const { params } = props;
      const validatedObj = wordParamsValidator.validate(props);
      expect(validatedObj).to.deep.equal(params);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = wordParamsValidator.validate(props);
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
