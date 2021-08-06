import { joi } from '../../../entities/utils/joi';
import { AvailableTimeQueryValidator } from './availableTimeQueryValidator';

const makeAvailableTimeQueryValidator = new AvailableTimeQueryValidator().init({ joi });

export { makeAvailableTimeQueryValidator };
