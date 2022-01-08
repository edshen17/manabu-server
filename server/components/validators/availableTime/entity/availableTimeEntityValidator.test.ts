import { expect } from 'chai';
import { makeAvailableTimeEntityValidator } from '.';
import {
  ENTITY_VALIDATOR_VALIDATE_MODE,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLE,
} from '../../abstractions/AbstractEntityValidator';
import { AvailableTimeEntityValidator } from './availableTimeEntityValidator';

let availableTimeEntityValidator: AvailableTimeEntityValidator;
let buildParams: {};

before(() => {
  availableTimeEntityValidator = makeAvailableTimeEntityValidator;
});

beforeEach(() => {
  const endDate = new Date();
  endDate.setMinutes(endDate.getMinutes() + 30);
  buildParams = {
    hostedById: '5d6ede6a0ba62570afcedd3a',
    startDate: new Date(),
    endDate,
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
          testValidInputs({
            validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
            userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
          });
        });
      });
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        buildParams = {
          hostedBy: '5d6ede6a0ba62570afssscedd3a',
        };
        it('should throw an error', () => {
          testInvalidInputs({
            validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
            userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
          });
        });
      });
      context('edit entity', () => {
        buildParams = {
          hostedById: {},
        };
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            testInvalidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
            });
          });
        });
        context('as an admin', () => {
          it('should throw an error', () => {
            testInvalidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN,
            });
          });
        });
      });
    });
  });
});
