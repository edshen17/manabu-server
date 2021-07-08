import { expect } from 'chai';
import { makeAppointmentEntityValidator } from '.';
import { AppointmentEntityValidator } from './appointmentEntityValidator';

let appointmentEntityValidator: AppointmentEntityValidator;
let buildParams: {};

before(() => {
  appointmentEntityValidator = makeAppointmentEntityValidator;
});

describe('appointmentEntityValidator', () => {
  describe('validate', () => {
    const testValidate = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      try {
        const validatedObj = appointmentEntityValidator.validate({
          validationMode: validationMode,
          userRole,
          buildParams,
        });
        expect(validatedObj).to.deep.equal(buildParams);
        expect(validatedObj).to.not.have.property('error');
      } catch (err) {
        expect(err).be.an('error');
      }
    };
    context('valid inputs', () => {
      context('create entity', () => {
        buildParams = {
          hostedBy: '5d6ede6a0ba62570afcedd3a',
          reservedBy: '5d6ede6a0ba62570afcedd3a',
          packageTransactionId: '5d6ede6a0ba62570afcedd3a',
          from: new Date(),
          to: new Date(),
          isPast: false,
          status: 'pending',
        };
        context('as a non-admin user', () => {
          it('should return a valid object', () => {
            testValidate({ validationMode: 'create', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should return a valid object', () => {
            testValidate({ validationMode: 'create', userRole: 'admin' });
          });
        });
      });
      context('edit entity', () => {
        context('as a non-admin user', () => {
          it('should return a valid object', () => {
            buildParams = {
              status: 'cancelled',
              cancellationReason: 'student cancel',
            };
            testValidate({ validationMode: 'edit', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should return a valid object', () => {
            buildParams = {
              role: 'teacher',
            };
            testValidate({ validationMode: 'edit', userRole: 'admin' });
          });
        });
      });
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        buildParams = {
          hostedBy: 5,
        };
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            testValidate({ validationMode: 'create', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should throw an error', () => {
            testValidate({ validationMode: 'create', userRole: 'admin' });
          });
        });
      });
      context('edit entity', () => {
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            buildParams = {
              hostedBy: 'some id',
              isPast: true,
            };
            testValidate({ validationMode: 'edit', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should throw an error', () => {
            testValidate({ validationMode: 'edit', userRole: 'admin' });
          });
        });
      });
    });
  });
});
