import { expect } from 'chai';
import { makeAvailableTimeEntityValidator } from '.';
import { AvailableTimeEntityValidator } from './availableTimeEntityValidator';

let availableTimeEntityValidator: AvailableTimeEntityValidator;
let buildParams: {};

before(() => {
  availableTimeEntityValidator = makeAvailableTimeEntityValidator;
});

beforeEach(() => {
  buildParams = {
    hostedById: '5d6ede6a0ba62570afcedd3a',
    startDate: new Date(),
    endDate: new Date(),
  };
});

describe('availableTimeEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      const validatedObj = availableTimeEntityValidator.validate({
        validationMode: validationMode,
        userRole,
        buildParams,
      });
      expect(validatedObj).to.deep.equal(buildParams);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      try {
        const validatedObj = availableTimeEntityValidator.validate({
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
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        buildParams = {
          hostedBy: '5d6ede6a0ba62570afssscedd3a',
        };
        it('should throw an error', () => {
          testInvalidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
      context('edit entity', () => {
        buildParams = {
          hostedById: {},
        };
        context('as a non-admin user', () => {
          it('should throw an error', () => {
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
