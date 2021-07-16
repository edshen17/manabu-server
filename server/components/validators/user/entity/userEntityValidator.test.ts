import { expect } from 'chai';
import { makeUserEntityValidator } from '.';
import { UserEntityValidator } from './userEntityValidator';

let userEntityValidator: UserEntityValidator;
let buildParams: {};

before(() => {
  userEntityValidator = makeUserEntityValidator;
});

beforeEach(() => {
  buildParams = {
    name: 'some name',
    password: 'Password!2',
    email: 'someEmail@gmail.com',
  };
});

describe('userEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      const validatedObj = userEntityValidator.validate({
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
        const validatedObj = userEntityValidator.validate({
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
              name: 'new name',
              password: 'NewPassword!2',
              email: 'newEmail@gmail.com',
              profileBio: 'new bio',
              languages: [{ language: 'ja', level: 'C2' }],
              settings: {
                currency: 'SGD',
                locale: 'en',
              },
              region: 'some region',
              timezone: 'some timezone',
            };
            testValidInputs({ validationMode: 'edit', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should return a valid object', () => {
            buildParams = {
              role: 'teacher',
            };
            testValidInputs({ validationMode: 'edit', userRole: 'admin' });
          });
        });
      });
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        it('should throw an error', () => {
          buildParams = {
            name: 5,
            password: 'weak password',
          };
          testInvalidInputs({ validationMode: 'create', userRole: 'user' });
        });
      });
      context('edit entity', () => {
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            buildParams = {
              verificationToken: 'some token',
              password: 'weak password',
              role: 'admin',
              dateRegistered: 'new date',
              nonExistent: 'some field',
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
