import { expect } from 'chai';
import { makeTeacherQueryValidator } from '.';
import { TeacherQueryValidator } from './teacherQueryValidator';

let teacherQueryValidator: TeacherQueryValidator;
let props: {
  query: {};
};

before(() => {
  teacherQueryValidator = makeTeacherQueryValidator;
  props = {
    query: {
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
    },
  };
});

describe('teacherQueryValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { query: {} }) => {
      const { query } = props;
      const validatedObj = teacherQueryValidator.validate(props);
      expect(validatedObj).to.deep.equal(query);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = (props: { query: {} }) => {
      try {
        const validatedObj = teacherQueryValidator.validate(props);
      } catch (err) {
        expect(err).be.an('error');
      }
    };
    context('valid inputs', () => {
      it('should return a valid object', () => {
        testValidInputs(props);
      });
    });
    context('invalid inputs', () => {
      it('should throw an error', () => {
        props.query = {
          someField: 'some value',
        };
        testInvalidInputs(props);
      });
      it('should throw an error', () => {
        props.query = {
          uId: 'some value',
        };
        testInvalidInputs(props);
      });
    });
  });
});
