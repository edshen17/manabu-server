import { expect } from 'chai';
import { makeAppointmentQueryValidator } from '.';
import { AppointmentQueryValidator } from './appointmentQueryValidator';

let appointmentQueryValidator: AppointmentQueryValidator;
let query: StringKeyObject;

before(() => {
  appointmentQueryValidator = makeAppointmentQueryValidator;
});

beforeEach(() => {
  query = {
    startDate: new Date(),
    endDate: new Date(),
  };
});

describe('appointmentQueryValidator', () => {
  describe('validate', () => {
    const testValidInputs = () => {
      const validatedObj = appointmentQueryValidator.validate({ query });
      expect(validatedObj).to.deep.equal(query);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = appointmentQueryValidator.validate({ query });
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
