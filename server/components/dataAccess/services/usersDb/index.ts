import bcrypt from 'bcryptjs';
import { makeDb, makeTeacherDbService } from '../..';
import { User } from '../../../../models/User';
import { makePackageDbService } from '../package';
import { UserDbService } from './usersDb';

const makeUserDbService = new UserDbService({
  userDb: User,
}).init({ makeDb, makeTeacherDbService, makePackageDbService, passwordLib: bcrypt });

export { makeUserDbService };
