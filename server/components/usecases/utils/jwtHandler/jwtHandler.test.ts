import { expect } from 'chai';
import { makeJwtHandler } from '.';
import { StringKeyObject } from '../../../../types/custom';
import { JwtHandler } from './jwtHandler';

let jwtHandler: JwtHandler;
let toTokenObj: StringKeyObject;
let token: string;
let decodedToken: StringKeyObject;

before(async () => {
  jwtHandler = await makeJwtHandler;
});

beforeEach(async () => {
  toTokenObj = {
    test: 'test',
  };
  token = jwtHandler.sign({
    toTokenObj,
    expiresIn: '1d',
  });
  try {
    decodedToken = await jwtHandler.verify(token);
  } catch (err) {
    return;
  }
});

describe('jwtHandler', () => {
  describe('sign', () => {
    it('should convert the given object to a signed jwt', () => {
      expect(token).to.be.a('string');
    });
  });
  describe('verify', () => {
    context('valid token', () => {
      it('should decode the token into an object', () => {
        expect(decodedToken.test).to.equal('test');
      });
    });
    context('invalid token', () => {
      it('should throw an error', async () => {
        await jwtHandler.blacklist(token);
        let error;
        try {
          await jwtHandler.verify(token);
        } catch (err) {
          error = err;
        }
        expect(error).to.be.an('error');
      });
    });
  });
  describe('blacklist', () => {
    it('should blacklist the token', async () => {
      const blacklistedToken = await jwtHandler.blacklist(token);
      expect(blacklistedToken).to.equal(token);
    });
  });
});
