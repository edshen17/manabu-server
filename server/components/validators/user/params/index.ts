import { joi } from '../../../entities/utils/joi';
import { UserParamsValidator } from './userParamsValidator';

const makeUserParamsValidator = new UserParamsValidator().init({ joi });

export { makeUserParamsValidator };
