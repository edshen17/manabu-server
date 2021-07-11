import { MinuteBankEntityValidator } from './minuteBankEntityValidator';
import { extendedJoi as joi } from '../../utils/joi/extendedJoi';

const makeMinuteBankEntityValidator = new MinuteBankEntityValidator().init({ joi });

export { makeMinuteBankEntityValidator };
