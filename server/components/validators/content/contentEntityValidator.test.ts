import { expect } from 'chai';
import faker from 'faker';
import { makeContentEntityValidator } from '.';
import {
  CONTENT_ENTITY_OWNERSHIP,
  CONTENT_ENTITY_TYPE,
} from '../../entities/content/contentEntity';
import {
  ENTITY_VALIDATOR_VALIDATE_MODE,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLE,
} from '../abstractions/AbstractEntityValidator';
import { ContentEntityValidator } from './contentEntityValidator';

let contentEntityValidator: ContentEntityValidator;
let buildParams: {};

before(() => {
  contentEntityValidator = makeContentEntityValidator;
});

beforeEach(() => {
  buildParams = {
    postedById: '605bc5ad9db900001528f77c',
    collectionId: '605bc5ad9db900001528f77c',
    title: 'test',
    coverImageUrl: faker.image.dataUri(),
    sourceUrl: faker.image.dataUri(),
    summary: 'summary',
    entities: [{ word: 'test', salience: 0.05 }],
    tokens: ['token'],
    categories: ['science'],
    ownership: CONTENT_ENTITY_OWNERSHIP.PRIVATE,
    author: 'wikipedia',
    type: CONTENT_ENTITY_TYPE.WIKIPEDIA,
  };
});

describe('contentEntityValidator', () => {
  describe('validate', () => {
    const testValidInputs = (props: { validationMode: string; userRole: string }) => {
      const { validationMode, userRole } = props;
      const validatedObj = contentEntityValidator.validate({
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
        const validatedObj = contentEntityValidator.validate({
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
          testValidInputs({
            validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
            userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
          });
        });
      });
      context('edit entity', () => {
        context('as a non-admin user', () => {
          it('should return a valid object', () => {
            buildParams = {
              summary: 'updated',
            };
            testValidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
            });
          });
        });
        context('as an admin', () => {
          it('should return a valid object', () => {
            buildParams = {
              title: 'new',
            };
            testValidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN,
            });
          });
        });
      });
    });
    context('invalid inputs', () => {
      context('create entity', () => {
        buildParams = {
          userId: '5d6ede6asdasdadas0ba62570afcedd3a',
        };
        it('should throw an error', () => {
          testInvalidInputs({
            validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
            userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
          });
        });
      });
      context('edit entity', () => {
        buildParams = {
          userId: '5d6ede6a0ba62570afcedd3a',
        };
        context('as a non-admin user', () => {
          it('should throw an error', () => {
            testInvalidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
            });
          });
        });
        context('as an admin', () => {
          it('should throw an error', () => {
            testInvalidInputs({
              validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
              userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN,
            });
          });
        });
      });
    });
  });
});
