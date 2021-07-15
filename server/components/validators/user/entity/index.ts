import { joi } from '../../../entities/utils/joi';
import { UserEntityValidator } from './userEntityValidator';

const makeUserEntityValidator = new UserEntityValidator().init({ joi });

export { makeUserEntityValidator };
