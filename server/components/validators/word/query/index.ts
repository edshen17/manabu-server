import { joi } from '../../../entities/utils/joi';
import { WordQueryValidator } from './wordQueryValidator';

const makeWordQueryValidator = new WordQueryValidator().init({ joi });

export { makeWordQueryValidator };
