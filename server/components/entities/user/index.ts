import bcrypt from 'bcryptjs';
import sanitizeHtml from 'sanitize-html';
import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import { UserEntity } from './userEntity';

import { EnvironmentVariables } from '../../../.env';

const sanitize = (text: string) => {
  // TODO: configure sanitizeHtml
  return sanitizeHtml(text);
};

const randTokenGenerator = (...args: any[]) => {
  const randToken = cryptoRandomString({ length: 15 });
  const secret = EnvironmentVariables.JWT_SECRET;
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

const makeUserEntity = new UserEntity({
  sanitize,
  inputValidator,
  passwordHasher,
  randTokenGenerator,
});

export { makeUserEntity };
