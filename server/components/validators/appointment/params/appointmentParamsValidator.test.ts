import { expect } from 'chai';
import { makeAppointmentParamsValidator } from '.';
import { AppointmentParamsValidator } from './appointmentParamsValidator';

let appointmentParamsValidator: AppointmentParamsValidator;
let props: {
  params: {};
};

before(() => {
  appointmentParamsValidator = makeAppointmentParamsValidator;
});

beforeEach(() => {
  props = {
    params: {
      appointmentId: '605bc5ad9db900001528f77c',
    },
  };
});

describe('appointmentParamsValidator', () => {
  describe('validate', () => {
    const testValidInputs = () => {
      const { params } = props;
      const validatedObj = appointmentParamsValidator.validate(props);
      expect(validatedObj).to.deep.equal(params);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = appointmentParamsValidator.validate(props);
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
          appointmentId: 'some value',
        };
        testInvalidInputs();
      });
    });
  });
});
