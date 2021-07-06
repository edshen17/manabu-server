import { expect } from 'chai';
import { makeUserEntityValidator } from '.';
import { UserEntityValidator } from './userEntityValidator';

let userEntityValidator: UserEntityValidator;
let requestBody: {};

before(() => {
  userEntityValidator = makeUserEntityValidator;
});

describe('userEntityValidator', () => {
  describe('validate', () => {
    context('valid inputs', () => {
      it('should return a valid object', () => {
        requestBody = {
          name: 'some name',
          password: 'Password!2',
          email: 'someEmail@gmail.com',
        };
        const validatedObj = userEntityValidator.validate(requestBody);
        expect(validatedObj).to.deep.equal(requestBody);
        expect(validatedObj).to.not.have.property('error');
      });
    });
    context('invalid inputs', () => {
      it('should throw an error', () => {
        try {
          requestBody = {
            name: 'some name',
            password: 'password',
            email: 'some    Email@gmail.com',
            _id: 'some id',
            dateRegisted: 'some date',
            role: 'admin',
          };
          const validatedObj = userEntityValidator.validate(requestBody);
        } catch (err) {
          expect(err).be.an('error');
        }
      });
    });
  });
});
