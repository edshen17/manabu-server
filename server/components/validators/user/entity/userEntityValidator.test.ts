import { expect } from 'chai';
import { makeUserEntityValidator } from '.';
import { UserEntityValidator } from './userEntityValidator';

let userEntityValidator: UserEntityValidator;
let buildParams: {};

before(() => {
  userEntityValidator = makeUserEntityValidator;
});

beforeEach(() => {
  buildParams = {};
});

describe('userEntityValidator', () => {
  describe('validate', () => {
    const testValidate = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      try {
        const validatedObj = userEntityValidator.validate({
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
          name: 'some name',
          password: 'Password!2',
          email: 'someEmail@gmail.com',
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
            testValidate({ validationMode: 'edit', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should return a valid object', () => {
            buildParams = {
              role: 'teacher',
            };
            testValidate({ validationMode: 'edit', userRole: 'admin' });
          });
        });
      });
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            buildParams = {
              name: 5,
              password: 'weak password',
            };
            testValidate({ validationMode: 'create', userRole: 'user' });
          });
        });
        context('as an admin', () => {
          it('should throw an error', () => {
            buildParams = {
              name: 5,
              password: 'weak password',
            };
            testValidate({ validationMode: 'create', userRole: 'admin' });
          });
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
