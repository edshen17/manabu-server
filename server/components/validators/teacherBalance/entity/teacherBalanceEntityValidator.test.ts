import { expect } from 'chai';
import { makeTeacherBalanceEntityValidator } from '.';
import { TeacherBalanceEntityValidator } from './teacherBalanceEntityValidator';

let teacherBalanceEntityValidator: TeacherBalanceEntityValidator;
let buildParams: {};

before(() => {
  teacherBalanceEntityValidator = makeTeacherBalanceEntityValidator;
});

describe('teacherBalanceEntityValidator', () => {
  describe('validate', () => {
    const testValidate = (props: { validationMode: string; userRole: string }) => {
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
      context('create entity', () => {
        buildParams = {
          userId: '5d6ede6a0ba62570afcedd3a',
          balanceDetails: {
            balance: 0,
            currency: 'SGD',
          },
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
          userId: '5d6ede6asdasdadas0ba62570afcedd3a',
          balanceDetails: {
            balance: '0',
            currency: 'SGDDDDD',
          },
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
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            buildParams = {
              userId: '5d6ede6a0ba62570afcedd3a',
              balanceDetails: {
                balance: 0,
                currency: 'SGD',
              },
            };
            testValidate({ validationMode: 'edit', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should throw an error', () => {
            buildParams = {
              verificationToken: 'some token',
              role: 'admin',
            };
            testValidate({ validationMode: 'edit', userRole: 'admin' });
          });
        });
      });
    });
  });
});
