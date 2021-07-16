import { expect } from 'chai';
import { makeTeacherBalanceEntityValidator } from '.';
import { TeacherBalanceEntityValidator } from './teacherBalanceEntityValidator';

let teacherBalanceEntityValidator: TeacherBalanceEntityValidator;
let buildParams: {};

before(() => {
  teacherBalanceEntityValidator = makeTeacherBalanceEntityValidator;
});

beforeEach(() => {
  buildParams = {
    userId: '5d6ede6a0ba62570afcedd3a',
    balanceDetails: {
      balance: 0,
      currency: 'SGD',
    },
  };
});

describe('teacherBalanceEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      try {
        const validatedObj = teacherBalanceEntityValidator.validate({
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
    const testInvalidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      try {
        const validatedObj = teacherBalanceEntityValidator.validate({
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
      it('should return a valid object', () => {
        testValidInputs({ validationMode: 'create', userRole: 'user' });
      });
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        buildParams = {
          userId: '5d6ede6asdasdadas0ba62570afcedd3a',
          balanceDetails: {
            balance: '0',
            currency: 'SGDDDDD',
          },
        };
        it('should throw an error', () => {
          testInvalidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
      context('edit entity', () => {
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            buildParams = {
              userId: '5d6ede6a0ba62570afcedd3a',
              balanceDetails: {
                balance: 0,
                currency: 'SGD',
              },
            };
            testInvalidInputs({ validationMode: 'edit', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should throw an error', () => {
            buildParams = {
              verificationToken: 'some token',
              role: 'admin',
            };
            testInvalidInputs({ validationMode: 'edit', userRole: 'admin' });
          });
        });
      });
    });
  });
});
