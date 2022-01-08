import { expect } from 'chai';
import { makePackageTransactionEntityValidator } from '.';
import {
  ENTITY_VALIDATOR_VALIDATE_MODE,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLE,
} from '../../abstractions/AbstractEntityValidator';
import { PackageTransactionEntityValidator } from './packageTransactionEntityValidator';

let packageTransactionEntityValidator: PackageTransactionEntityValidator;
let buildParams: {};

before(() => {
  packageTransactionEntityValidator = makePackageTransactionEntityValidator;
});

beforeEach(() => {
  buildParams = {
    hostedById: '5d6ede6a0ba62570afcedd3a',
    reservedById: '5d6ede6a0ba62570afcedd3a',
    packageId: '5d6ede6a0ba62570afcedd3a',
    lessonDuration: 30,
    remainingAppointments: 5,
    remainingReschedules: 5,
    lessonLanguage: 'ja',
    isSubscription: true,
  };
});

describe('packageTransactionEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      const validatedObj = packageTransactionEntityValidator.validate({
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
        const validatedObj = packageTransactionEntityValidator.validate({
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
          hostedById: '5d6ede6a0ba62570afssscedd3a',
          reservedById: '5d6ede6a0ba62570afasdcedd3a',
          packageId: '5d6ede6a0ba62570afcsaddedd3a',
          transactionDate: 'new Date()',
          lessonDuration: '5',
          transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
          terminationDate: null,
          isTerminated: false,
          remainingAppointments: 5,
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
          remainingAppointments: 2,
          isTerminated: true,
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
