import bcrypt from 'bcryptjs';
import { makeDb, makePackageDbService, makeTeacherDbService } from '../..';
import { User } from '../../../../models/User';
import { UserDbService } from './usersDb';

const makeUserDbService = new UserDbService({
  userDb: User,
}).init({ makeDb, makeTeacherDbService, makePackageDbService, passwordLib: bcrypt });

export { makeUserDbService };
