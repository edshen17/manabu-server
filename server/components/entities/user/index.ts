import { hashSync as hashPassword } from 'bcryptjs';
import cryptoRandomString from 'crypto-random-string';
import { sign as signJwt } from 'jsonwebtoken';
import { makePackageEntityValidator } from '../../validators/package/entity';
import { makeTeacherEntityValidator } from '../../validators/teacher/entity';
import { makeUserEntityValidator } from '../../validators/user/entity';
import { makeNGramHandler } from '../utils/nGramHandler';
import { UserEntity } from './userEntity';

const makeUserEntity = new UserEntity().init({
  hashPassword,
  signJwt,
  cryptoRandomString,
  makeEntityValidator: makeUserEntityValidator,
  makeTeacherEntityValidator,
  makePackageEntityValidator,
  makeNGramHandler,
});

export { makeUserEntity };
