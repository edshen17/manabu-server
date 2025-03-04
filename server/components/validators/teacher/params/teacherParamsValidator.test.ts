import { expect } from 'chai';
import { makeTeacherParamsValidator } from '.';
import { TeacherParamsValidator } from './teacherParamsValidator';

let teacherParamsValidator: TeacherParamsValidator;
let props: {
  params: {};
};

before(() => {
  teacherParamsValidator = makeTeacherParamsValidator;
});

beforeEach(() => {
  props = {
    params: {
      teacherId: '605bc5ad9db900001528f77c',
    },
  };
});

describe('teacherParamsValidator', () => {
  describe('validate', () => {
    const testValidInputs = () => {
      const { params } = props;
      const validatedObj = teacherParamsValidator.validate(props);
      expect(validatedObj).to.deep.equal(params);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = teacherParamsValidator.validate(props);
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
        props.params = {
          someField: 'some value',
        };
        testInvalidInputs();
      });
      it('should throw an error', () => {
        props.params = {
          teacherId: 'some value',
        };
        testInvalidInputs();
      });
    });
  });
});
