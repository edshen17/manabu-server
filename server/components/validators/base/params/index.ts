import { joi } from '../../../entities/utils/joi';
import { BaseParamsValidator } from './baseParamsValidator';

const makeBaseParamsValidator = new BaseParamsValidator().init({ joi });

export { makeBaseParamsValidator };
