import { expect } from 'chai';
import { makeWordQueryValidator } from '.';
import { WordQueryValidator } from './wordQueryValidator';

let wordQueryValidator: WordQueryValidator;
let props: {
  query: {};
};

before(() => {
  wordQueryValidator = makeWordQueryValidator;
  props = {
    query: {
      wordLanguage: 'ja',
      definitionLanguage: 'ja',
      page: 0,
      limit: 10,
    },
  };
});

describe('wordQueryValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { query: {} }) => {
      const { query } = props;
      const validatedObj = wordQueryValidator.validate(props);
      expect(validatedObj).to.deep.equal(query);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = (props: { query: {} }) => {
      try {
        const validatedObj = wordQueryValidator.validate(props);
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
        props.query = {
          someField: 'some value',
        };
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
