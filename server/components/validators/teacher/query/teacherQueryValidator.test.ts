import { expect } from 'chai';
import { makeTeacherQueryValidator } from '.';
import { StringKeyObject } from '../../../../types/custom';
import { TeacherQueryValidator } from './teacherQueryValidator';

let teacherQueryValidator: TeacherQueryValidator;
let query: StringKeyObject;

before(() => {
  teacherQueryValidator = makeTeacherQueryValidator;
});

beforeEach(() => {
  query = {
    teachingLanguages: ['ja'],
    alsoSpeaks: ['en'],
    teacherType: ['licensed'],
    maxPrice: 40,
    minPrice: 30,
    teacherTags: ['kids', 'business', 'exam preparation', 'conversation practice', 'general'],
    packageTags: ['grammar', 'reading', 'writing', 'pitch accent'],
    lessonDurations: [30, 60, 90, 120],
    contactMethodName: ['Skype', 'LINE'],
    contactMethodType: ['online', 'offline'],
  };
});

describe('teacherQueryValidator', () => {
  describe('validate', () => {
    const testValidInputs = () => {
      const validatedObj = teacherQueryValidator.validate({ query });
      expect(validatedObj).to.deep.equal(query);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = teacherQueryValidator.validate({ query });
      } catch (err) {
        expect(err).be.an('error');
      }
    };
    context('valid inputs', () => {
      it('should return a valid object', () => {
        testValidInputs();
      });
    });
    context('invalid inputs', () => {
      it('should throw an error', () => {
        query = {
          uId: 'some value',
          maxValue: -5,
        };
        testInvalidInputs();
      });
    });
  });
});
