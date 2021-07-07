import { hashSync as hashPassword } from 'bcryptjs';
import { sign as signJwt } from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import { UserEntity } from './userEntity';
import { makeUserEntityValidator } from './validator';

const makeUserEntity = new UserEntity().init({
  hashPassword,
  signJwt,
  cryptoRandomString,
  makeEntityValidator: makeUserEntityValidator,
});

export { makeUserEntity };
