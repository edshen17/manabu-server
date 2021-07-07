import { expect } from 'chai';
import { makeTeacherEntityValidator } from '.';
import { TeacherEntityValidator } from './teacherEntityValidator';

let teacherEntityValidator: TeacherEntityValidator;
let requestBody: {};

before(() => {
  teacherEntityValidator = makeTeacherEntityValidator;
});

describe('teacherEntityValidator', () => {
  describe('validate', () => {
    context('valid inputs', () => {
      it('should return a valid object', () => {
        requestBody = {
          userId: '5d6ede6a0ba62570afcedd3a',
        };
        const validatedObj = teacherEntityValidator.validate(requestBody);
        expect(validatedObj).to.deep.equal(requestBody);
        expect(validatedObj).to.not.have.property('error');
      });
    });
    context('invalid inputs', () => {
      it('should throw an error', () => {
        try {
          requestBody = {
            name: 'id',
          };
          const validatedObj = teacherEntityValidator.validate(requestBody);
        } catch (err) {
          expect(err).be.an('error');
        }
      });
    });
  });
});
