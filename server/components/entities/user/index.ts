import bcrypt from 'bcryptjs'; // import { ... as bcryptjs }
import sanitizeHtml from 'sanitize-html';
import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import { UserEntity } from './userEntity';

const makeUserEntity = new UserEntity().init({
  bcrypt,
  sanitizeHtml,
  jwt,
  cryptoRandomString,
});

export { makeUserEntity };
