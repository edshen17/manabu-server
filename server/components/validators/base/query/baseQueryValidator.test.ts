import { expect } from 'chai';
import { makeBaseQueryValidator } from '.';
import { BaseQueryValidator } from './baseQueryValidator';

let baseQueryValidator: BaseQueryValidator;
let props = {
  query: {},
};

before(() => {
  baseQueryValidator = makeBaseQueryValidator;
  props.query = {};
});

describe('baseQueryValidator', () => {
  describe('validate', () => {
    const testValidate = (props: { query: {} }) => {
      const { query } = props;
      try {
        const validatedObj = baseQueryValidator.validate(props);
        expect(validatedObj).to.deep.equal(query);
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
        props.query = {
          someField: 'some value',
        };
        testValidate(props);
      });
    });
  });
});
