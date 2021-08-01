import { hashSync as hashPassword } from 'bcryptjs';
import { sign as signJwt } from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import { UserEntity } from './userEntity';
import { makeUserEntityValidator } from '../../validators/user/entity';
import { makeTeacherEntityValidator } from '../../validators/teacher/entity';
import { makePackageEntityValidator } from '../../validators/package/entity';
import { makeNGramHandler } from '../utils/nGramHandler';

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
