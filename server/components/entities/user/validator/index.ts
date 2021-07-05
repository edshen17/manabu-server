import { extendedJoi as joi } from '../../utils/joi/extendedJoi';
import { UserEntityValidator } from './userEntityValidator';

const makeUserEntityValidator = new UserEntityValidator().init({ joi });

export { makeUserEntityValidator };
