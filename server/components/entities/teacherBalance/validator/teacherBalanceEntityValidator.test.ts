import { expect } from 'chai';
import { makeTeacherBalanceEntityValidator } from '.';
import { TeacherBalanceEntityValidator } from './teacherBalanceEntityValidator';

let teacherBalanceEntityValidator: TeacherBalanceEntityValidator;
let requestBody: {};

before(() => {
  teacherBalanceEntityValidator = makeTeacherBalanceEntityValidator;
});

describe('teacherBalanceEntityValidator', () => {
  describe('validate', () => {
    context('valid inputs', () => {
      it('should return a valid object', () => {
        requestBody = {
          userId: '5d6ede6a0ba62570afcedd3a',
        };
        const validatedObj = teacherBalanceEntityValidator.validate(requestBody);
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
          const validatedObj = teacherBalanceEntityValidator.validate(requestBody);
        } catch (err) {
          expect(err).be.an('error');
        }
      });
    });
  });
});
