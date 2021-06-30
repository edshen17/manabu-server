import { hashSync as hashPassword } from 'bcryptjs'; // import { ... as bcryptjs }
// import sanitizeHtml from 'sanitize-html';
import { sign as signJwt } from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import { UserEntity } from './userEntity';

const makeUserEntity = new UserEntity().init({
  hashPassword,
  // sanitizeHtml,
  signJwt,
  cryptoRandomString,
});

export { makeUserEntity };
