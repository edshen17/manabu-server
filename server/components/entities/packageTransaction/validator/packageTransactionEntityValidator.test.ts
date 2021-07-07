import { expect } from 'chai';
import { makePackageTransactionEntityValidator } from '.';
import { PackageTransactionEntityValidator } from './packageTransactionEntityValidator';

let packageTransactionEntityValidator: PackageTransactionEntityValidator;
let requestBody: {};

before(() => {
  packageTransactionEntityValidator = makePackageTransactionEntityValidator;
});

describe('packageTransactionEntityValidator', () => {
  describe('validate', () => {
    context('valid inputs', () => {
      it('should return a valid object', () => {
        requestBody = {
          hostedBy: '5d6ede6a0ba62570afcedd3a',
          reservedBy: '5d6ede6a0ba62570afcedd3a',
          packageId: '5d6ede6a0ba62570afcedd3a',
          transactionDate: new Date(),
          reservationLength: 5,
          transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
          terminationDate: new Date(),
          isTerminated: false,
          remainingAppointments: 5,
          remainingReschedules: 5,
          lessonLanguage: 'ja',
          isSubscription: true,
          methodData: { method: 'Paypal', paymentId: '5d6ede6a0ba62570afcedd3a' },
        };
        const validatedObj = packageTransactionEntityValidator.validate(requestBody);
        expect(validatedObj).to.deep.equal(requestBody);
        expect(validatedObj).to.not.have.property('error');
      });
    });
    context('invalid inputs', () => {
      it('should throw an error', () => {
        try {
          requestBody = {
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
          const validatedObj = packageTransactionEntityValidator.validate(requestBody);
        } catch (err) {
          expect(err).be.an('error');
        }
      });
    });
  });
});
