import { expect } from 'chai';
import { makeContentParamsValidator } from '.';
import { ContentParamsValidator } from './contentParamsValidator';

let contentParamsValidator: ContentParamsValidator;
let props: {
  params: {};
};

before(() => {
  contentParamsValidator = makeContentParamsValidator;
});

beforeEach(() => {
  props = {
    params: {
      contentId: '605bc5ad9db900001528f77c',
    },
  };
});

describe('contentParamsValidator', () => {
  describe('validate', () => {
    const testValidInputs = () => {
      const { params } = props;
      const validatedObj = contentParamsValidator.validate(props);
      expect(validatedObj).to.deep.equal(params);
      expect(validatedObj).to.not.have.property('error');
    };
    const testInvalidInputs = () => {
      try {
        const validatedObj = contentParamsValidator.validate(props);
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
          availableTimeId: 'some value',
        };
        testInvalidInputs();
      });
    });
  });
});
