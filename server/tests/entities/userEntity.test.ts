import bcrypt from 'bcryptjs';
import sanitizeHtml from 'sanitize-html';
import jwt from 'jsonwebtoken';
import chai from 'chai';
import cryptoRandomString from 'crypto-random-string';
import { UserEntity } from '../../components/entities/user/userEntity';

const sanitize = (text: string) => {
  // TODO: configure sanitizeHtml
  return sanitizeHtml(text);
};

const randTokenGenerator = (...args: any[]) => {
  const randToken = cryptoRandomString({ length: 15 });
  const secret = 'test';
  const verificationToken = jwt.sign({ randToken, ...args }, secret, {
    expiresIn: 24 * 60 * 60 * 7,
  });

  return verificationToken;
};

const inputValidator = {
  // TODO: Finish all validations
  isValidName: () => {
    return true;
  },
  isValidEmail: () => {
    return true;
  },
  isValidPassword: () => {
    return true;
  },
  isValidURL: () => {
    return true;
  },
};

const passwordHasher = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

const expect = chai.expect;

let userEntity = new UserEntity({ sanitize, inputValidator, passwordHasher, randTokenGenerator });

describe('user entity', () => {
  it('should not throw an error if no user data is provided', () => {
    const emptyName = userEntity.build({}).getName();
    expect(emptyName).to.equal(undefined);
  });
  it('should get the correct data provided good input', () => {
    const testEntity = userEntity.build({
      name: 'test',
      password: 'pass',
      email: 'test@gmail.com',
    });
    expect(testEntity.getName()).to.equal('test');
    expect(testEntity.getPassword()).to.not.equal('pass');
    expect(testEntity.getEmail()).to.equal('test@gmail.com');
    expect(testEntity.getProfileImage()).to.equal('');
    expect(testEntity.getVerificationToken()).to.not.equal('');
  });
});
