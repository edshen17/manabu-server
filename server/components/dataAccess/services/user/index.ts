import bcrypt from 'bcryptjs';
import { makeDb } from '../..';
import { User } from '../../../../models/User';
import { makePackageDbService } from '../package';
import { makeTeacherDbService } from '../teacher';
import { UserDbService } from './userDbService';

const makeUserDbService = new UserDbService().init({
  makeDb,
  dbModel: User,
  makeTeacherDbService,
  makePackageDbService,
  passwordLib: bcrypt,
});

export { makeUserDbService };
