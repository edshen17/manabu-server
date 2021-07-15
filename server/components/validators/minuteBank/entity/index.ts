import { MinuteBankEntityValidator } from './minuteBankEntityValidator';
import { joi } from '../../../entities/utils/joi';

const makeMinuteBankEntityValidator = new MinuteBankEntityValidator().init({ joi });

export { makeMinuteBankEntityValidator };
