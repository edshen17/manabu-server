import { expect } from 'chai';
import { makeJwtHandler } from '.';
import { StringKeyObject } from '../../../../types/custom';
import { JwtHandler } from './jwtHandler';

let jwtHandler: JwtHandler;
let toTokenObj: StringKeyObject;
let token: string;
let decodedToken: StringKeyObject;

before(() => {
  jwtHandler = makeJwtHandler;
});

beforeEach(() => {
  toTokenObj = {
    test: 'test',
  };
  token = jwtHandler.sign({
    toTokenObj,
    expiresIn: '1d',
  });
  decodedToken = jwtHandler.verify(token);
});

describe('jwtHandler', () => {
  describe('sign', () => {
    it('should convert the given object to a signed jwt', async () => {
      expect(token).to.be.a('string');
    });
  });
  describe('verify', () => {
    it('should decode the token into an object', async () => {
      expect(decodedToken.test).to.equal('test');
    });
  });
});
