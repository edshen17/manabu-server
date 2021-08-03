import { AvailableTimeEntityValidator } from './availableTimeEntityValidator';
import { joi } from '../../../entities/utils/joi';

const makeAvailableTimeEntityValidator = new AvailableTimeEntityValidator().init({ joi });

export { makeAvailableTimeEntityValidator };
