import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeIncomeReportEntityValidator } from '.';
import {
  ENTITY_VALIDATOR_VALIDATE_MODE,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLE,
} from '../../abstractions/AbstractEntityValidator';
import { IncomeReportEntityValidator } from './incomeReportEntityValidator';

let incomeReportEntityValidator: IncomeReportEntityValidator;
let buildParams: {};

before(() => {
  incomeReportEntityValidator = makeIncomeReportEntityValidator;
});

beforeEach(() => {
  buildParams = {
    revenue: 100,
    wageExpense: 50,
    rentExpense: 0,
    advertisingExpense: 0,
    depreciationExpense: 0,
    suppliesExpense: 0,
    internetExpense: 0,
    totalExpense: 0,
    netIncome: 50,
    startDate: dayjs().toDate(),
    endDate: dayjs().add(1, 'month').toDate(),
  };
});

describe('incomeReportEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      const validatedObj = incomeReportEntityValidator.validate({
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
        const validatedObj = incomeReportEntityValidator.validate({
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
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            testInvalidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
            });
          });
        });
        context('as an admin user', () => {
          it('should return a valid object', () => {
            testValidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
            });
          });
        });
      });
      context('edit entity', () => {
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            testInvalidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
            });
          });
        });
        context('as an admin user', () => {
          it('should return a valid object', () => {
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
