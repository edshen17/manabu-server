import { expect } from 'chai';
import { makePackageEntityValidator } from '.';
import {
  ENTITY_VALIDATOR_VALIDATE_MODE,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLE,
} from '../../abstractions/AbstractEntityValidator';
import { PackageEntityValidator } from './packageEntityValidator';

let packageEntityValidator: PackageEntityValidator;
let buildParams: {};

before(() => {
  packageEntityValidator = makePackageEntityValidator;
});

beforeEach(() => {
  buildParams = {
    priceData: {
      currency: 'SGD',
      hourlyRate: 10,
    },
    lessonAmount: 5,
    isOffering: true,
    type: 'custom',
    lessonDurations: [30],
  };
});

describe('packageEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      const validatedObj = packageEntityValidator.validate({
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
        const validatedObj = packageEntityValidator.validate({
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
      context('edit entity', () => {
        context('as a non-admin user', () => {
          it('should return a valid object', () => {
            buildParams = {
              priceData: {
                currency: 'SGD',
                hourlyRate: 20,
              },
              lessonAmount: 5,
              isOffering: false,
              type: 'custom',
              lessonDurations: [30],
            };
            testValidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
            });
          });
        });
        context('as an admin user', () => {
          it('should return a valid object', () => {
            buildParams = {
              priceData: {
                currency: 'SGD',
                hourlyRate: 20,
              },
              lessonAmount: 5,
              isOffering: false,
              type: 'custom',
              lessonDurations: [30],
            };
            testValidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN,
            });
          });
        });
      });
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        buildParams = {
          lessonDurations: [30, 30],
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
          hostedById: 'id',
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
