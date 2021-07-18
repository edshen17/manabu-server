import { expect } from 'chai';
import faker from 'faker';
import { makeTeacherEntityValidator } from '.';
import { TeacherEntityValidator } from './teacherEntityValidator';

let teacherEntityValidator: TeacherEntityValidator;
let buildParams: {};

before(() => {
  teacherEntityValidator = makeTeacherEntityValidator;
});

beforeEach(() => {
  buildParams = {};
});

describe('teacherEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      const validatedObj = teacherEntityValidator.validate({
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
        const validatedObj = teacherEntityValidator.validate({
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
        context('as a non-admin user', () => {
          it('should return a valid object', () => {
            buildParams = {
              priceData: {
                hourlyRate: 35,
                currency: 'SGD',
              },
              licensePathUrl: faker.image.dataUri(),
            };
            testValidInputs({ validationMode: 'edit', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should return a valid object', () => {
            buildParams = {
              applicationStatus: 'approved',
              isHidden: false,
            };
            testValidInputs({ validationMode: 'edit', userRole: 'admin' });
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
        it('should throw an error', () => {
          testInvalidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
      context('edit entity', () => {
        buildParams = {
          userId: '5d6ede6a0ba62570afcedd3a',
          teacherType: 'professional',
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
