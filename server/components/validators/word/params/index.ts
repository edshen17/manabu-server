import { joi } from '../../../entities/utils/joi';
import { WordParamsValidator } from './wordParamsValidator';

const makeWordParamsValidator = new WordParamsValidator().init({ joi });

export { makeWordParamsValidator };
