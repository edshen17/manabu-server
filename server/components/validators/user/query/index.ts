import { joi } from '../../../entities/utils/joi';
import { UserQueryValidator } from './userQueryValidator';

const makeUserQueryValidator = new UserQueryValidator().init({ joi });

export { makeUserQueryValidator };
