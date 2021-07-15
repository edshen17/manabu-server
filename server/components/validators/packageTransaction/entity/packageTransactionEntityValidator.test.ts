import { expect } from 'chai';
import { makePackageTransactionEntityValidator } from '.';
import { PackageTransactionEntityValidator } from './packageTransactionEntityValidator';

let packageTransactionEntityValidator: PackageTransactionEntityValidator;
let buildParams: {};

before(() => {
  packageTransactionEntityValidator = makePackageTransactionEntityValidator;
});

describe('packageTransactionEntityValidator', () => {
  describe('validate', () => {
    const testValidate = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      try {
        const validatedObj = packageTransactionEntityValidator.validate({
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
          packageId: '5d6ede6a0ba62570afcedd3a',
          reservationLength: 5,
          transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
          terminationDate: new Date(),
          remainingAppointments: 5,
          remainingReschedules: 5,
          lessonLanguage: 'ja',
          isSubscription: true,
          methodData: { method: 'Paypal', paymentId: '5d6ede6a0ba62570afcedd3a' },
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
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        buildParams = {
          hostedBy: '5d6ede6a0ba62570afssscedd3a',
          reservedBy: '5d6ede6a0ba62570afasdcedd3a',
          packageId: '5d6ede6a0ba62570afcsaddedd3a',
          transactionDate: 'new Date()',
          reservationLength: '5',
          transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
          terminationDate: null,
          isTerminated: false,
          remainingAppointments: 5,
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
        buildParams = {
          remainingAppointments: 2,
          isTerminated: true,
        };
        context('as a non-admin user', () => {
          it('should throw an error', () => {
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
