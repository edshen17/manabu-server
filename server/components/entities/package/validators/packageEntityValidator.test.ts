import { expect } from 'chai';
import { makePackageEntityValidator } from '.';
import { PackageEntityValidator } from './packageEntityValidator';

let packageEntityValidator: PackageEntityValidator;
let buildParams: {};

before(() => {
  packageEntityValidator = makePackageEntityValidator;
});

describe('packageEntityValidator', () => {
  describe('validate', () => {
    const testValidate = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      try {
        const validatedObj = packageEntityValidator.validate({
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
          priceDetails: {
            currency: 'SGD',
            hourlyPrice: 10,
          },
          lessonAmount: 5,
          isOffering: true,
          packageType: 'light',
          packageDurations: [30],
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
        buildParams = {
          priceDetails: {
            currency: 'SGD',
            hourlyPrice: 20,
          },
          lessonAmount: 5,
          isOffering: false,
          packageType: 'custom',
          packageDurations: [30],
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
          packageDurations: [30, 30],
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
          hostedBy: 'id',
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
