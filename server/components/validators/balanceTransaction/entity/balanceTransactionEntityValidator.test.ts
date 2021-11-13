import { expect } from 'chai';
import { makeBalanceTransactionEntityValidator } from '.';
import {
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import { BalanceTransactionEntityValidator } from './balanceTransactionEntityValidator';

let balanceTransactionEntityValidator: BalanceTransactionEntityValidator;
let buildParams: {};

before(() => {
  balanceTransactionEntityValidator = makeBalanceTransactionEntityValidator;
});

beforeEach(() => {
  buildParams = {
    userId: '5d6ede6a0ba62570afcedd3a',
    status: BALANCE_TRANSACTION_ENTITY_STATUS.PENDING,
    currency: 'SGD',
    type: BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
    packageTransactionId: undefined,
    amount: 100,
    processingFee: 5,
    tax: 0.2,
    total: 105.2,
    runningBalance: {
      currency: 'SGD',
      totalAvailable: 0,
    },
    paymentData: {
      gateway: 'paypal',
      id: 'some id',
    },
  };
});

describe('balanceTransactionEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      const validatedObj = balanceTransactionEntityValidator.validate({
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
        const validatedObj = balanceTransactionEntityValidator.validate({
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
          userId: '5d6ede6a0ba62570afssscedd3a',
          runningBalance: {
            totalAvailable: -10,
            currency: 'SGD',
          },
        };
        it('should throw an error', () => {
          testInvalidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
      context('edit entity', () => {
        buildParams = {
          userId: 2,
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
