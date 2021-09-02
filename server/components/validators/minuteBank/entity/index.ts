import { joi } from '../../../entities/utils/joi';
import { MinuteBankEntityValidator } from './minuteBankEntityValidator';

const makeMinuteBankEntityValidator = new MinuteBankEntityValidator().init({ joi });

export { makeMinuteBankEntityValidator };
