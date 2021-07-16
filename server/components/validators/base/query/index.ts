import { joi } from '../../../entities/utils/joi';
import { BaseQueryValidator } from './baseQueryValidator';

const makeBaseQueryValidator = new BaseQueryValidator().init({ joi });

export { makeBaseQueryValidator };
