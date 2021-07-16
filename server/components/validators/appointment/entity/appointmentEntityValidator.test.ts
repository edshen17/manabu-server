import { expect } from 'chai';
import { makeAppointmentEntityValidator } from '.';
import { AppointmentEntityValidator } from './appointmentEntityValidator';

let appointmentEntityValidator: AppointmentEntityValidator;
let buildParams: {};

before(() => {
  appointmentEntityValidator = makeAppointmentEntityValidator;
});

beforeEach(() => {
  buildParams = {
    hostedById: '5d6ede6a0ba62570afcedd3a',
    reservedById: '5d6ede6a0ba62570afcedd3a',
    packageTransactionId: '5d6ede6a0ba62570afcedd3a',
    startTime: new Date(),
    endTime: new Date(),
  };
});

describe('appointmentEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      const validatedObj = appointmentEntityValidator.validate({
        validationMode: validationMode,
        userRole,
        buildParams,
      });
      expect(validatedObj).to.deep.equal(buildParams);
      expect(validatedObj).to.not.have.property('error');
    };

    const testInvalidInputs = (props: { validationMode: string; userRole: string }) => {
      try {
        const { validationMode, userRole } = props;
        const validatedObj = appointmentEntityValidator.validate({
          validationMode: validationMode,
          userRole,
          buildParams,
        });
      } catch (err) {
        expect(err).be.an('error');
      }
    };
    context('valid inputs', () => {
      context('create entity', () => {
        it('should return a valid object', () => {
          testValidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
      context('edit entity', () => {
        context('as a non-admin user', () => {
          it('should return a valid object', () => {
            buildParams = {
              status: 'cancelled',
              cancellationReason: 'student cancel',
            };
            testValidInputs({ validationMode: 'edit', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should return a valid object', () => {
            buildParams = {
              status: 'cancelled',
              cancellationReason: 'student cancel',
            };
            testValidInputs({ validationMode: 'edit', userRole: 'admin' });
          });
        });
      });
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        buildParams = {
          hostedById: 5,
        };
        it('should throw an error', () => {
          testInvalidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
      context('edit entity', () => {
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            buildParams = {
              hostedById: 'some id',
              isPast: true,
            };
            testInvalidInputs({ validationMode: 'edit', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should throw an error', () => {
            testInvalidInputs({ validationMode: 'edit', userRole: 'admin' });
          });
        });
      });
    });
  });
});
