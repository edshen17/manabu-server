import { expect } from 'chai';
import { makePackageTransactionCheckoutEntityValidator } from '.';
import { PackageTransactionCheckoutEntityValidator } from './packageTransactionCheckoutEntityValidator';

let packageTransactionCheckoutEntityValidator: PackageTransactionCheckoutEntityValidator;
let buildParams: {};

before(() => {
  packageTransactionCheckoutEntityValidator = makePackageTransactionCheckoutEntityValidator;
});

beforeEach(() => {
  buildParams = {
    teacherId: '5d6ede6a0ba62570afcedd3a',
    packageId: '5d6ede6a0ba62570afcedd3a',
  };
});

describe('packageTransactionCheckoutEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      const validatedObj = packageTransactionCheckoutEntityValidator.validate({
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
        const validatedObj = packageTransactionCheckoutEntityValidator.validate({
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
          hostedBy: '5d6ede6a0ba62570afssscedd3a',
          reservedBy: '5d6ede6a0ba62570afasdcedd3a',
          hostedByData: '5d6ede6a0ba62570afcsaddedd3a',
        };
        it('should throw an error', () => {
          testInvalidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
    });
  });
});
