import { expect } from 'chai';
import { makeAvailableTimeQueryValidator } from '.';
import { AvailableTimeQueryValidator } from './availableTimeQueryValidator';

let availableTimeQueryValidator: AvailableTimeQueryValidator;
let query: StringKeyObject;

before(() => {
  availableTimeQueryValidator = makeAvailableTimeQueryValidator;
});

beforeEach(() => {
  query = {
    startDate: new Date(),
    endDate: new Date(),
  };
});

describe('availableTimeQueryValidator', () => {
  describe('validate', () => {
    const testValidInputs = () => {
      const validatedObj = availableTimeQueryValidator.validate({ query });
      expect(validatedObj).to.deep.equal(query);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = availableTimeQueryValidator.validate({ query });
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
        query.startDate = 'some date';
        testInvalidInputs();
      });
    });
  });
});
