import { expect } from 'chai';
import { makePackageEntityValidator } from '.';
import { PackageEntityValidator } from './packageEntityValidator';

let packageEntityValidator: PackageEntityValidator;
let buildParams: {};

before(() => {
  packageEntityValidator = makePackageEntityValidator;
});

beforeEach(() => {
  buildParams = {
    hostedById: '5d6ede6a0ba62570afcedd3a',
    priceData: {
      currency: 'SGD',
      hourlyRate: 10,
    },
    lessonAmount: 5,
    isOffering: true,
    packageType: 'custom',
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
          testValidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
      context('edit entity', () => {
        buildParams = {
          priceData: {
            currency: 'SGD',
            hourlyRate: 20,
          },
          lessonAmount: 5,
          isOffering: false,
          packageType: 'custom',
          lessonDurations: [30],
        };
        it('should return a valid object', () => {
          testValidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        buildParams = {
          lessonDurations: [30, 30],
        };
        it('should throw an error', () => {
          testInvalidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
      context('edit entity', () => {
        buildParams = {
          hostedById: 'id',
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
