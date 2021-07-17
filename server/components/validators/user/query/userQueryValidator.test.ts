import { expect } from 'chai';
import { makeUserQueryValidator } from '.';
import { UserQueryValidator } from './userQueryValidator';

let userQueryValidator: UserQueryValidator;
let props: {
  query: {};
};

before(() => {
  userQueryValidator = makeUserQueryValidator;
  props = {
    query: {
      state: {
        redirectUserId: '605bc5ad9db900001528f77c',
        isTeacherApp: true,
      },
    },
  };
});

describe('userQueryValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { query: {} }) => {
      const { query } = props;
      const validatedObj = userQueryValidator.validate(props);
      expect(validatedObj).to.deep.equal(query);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = (props: { query: {} }) => {
      const { query } = props;
      try {
        const validatedObj = userQueryValidator.validate(props);
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
