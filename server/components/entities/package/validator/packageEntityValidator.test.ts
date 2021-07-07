import { expect } from 'chai';
import { makePackageEntityValidator } from '.';
import { PackageEntityValidator } from './packageEntityValidator';

let packageEntityValidator: PackageEntityValidator;
let requestBody: {};

before(() => {
  packageEntityValidator = makePackageEntityValidator;
});

describe('packageEntityValidator', () => {
  describe('validate', () => {
    context('valid inputs', () => {
      it('should return a valid object', () => {
        requestBody = {
          hostedBy: '5d6ede6a0ba62570afcedd3a',
          priceDetails: { currency: 'SGD', hourlyPrice: 5 },
          lessonAmount: 5,
          isOffering: true,
          packageType: 'light',
          packageDurations: [30, 90],
        };
        const validatedObj = packageEntityValidator.validate(requestBody);
        expect(validatedObj).to.deep.equal(requestBody);
        expect(validatedObj).to.not.have.property('error');
      });
    });
    context('invalid inputs', () => {
      it('should throw an error', () => {
        try {
          requestBody = {
            hostedBy: '5d6ede6a0ba62570afcedd3a',
            priceDetails: { currency: 'SGD', hourlyPrice: 5 },
            lessonAmount: 5,
            isOffering: true,
            packageType: 'light',
            packageDurations: [30, 30, 60, 60],
          };
          const validatedObj = packageEntityValidator.validate(requestBody);
        } catch (err) {
          expect(err).be.an('error');
        }
      });
    });
  });
});
