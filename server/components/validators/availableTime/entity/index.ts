import { joi } from '../../../entities/utils/joi';
import { AvailableTimeEntityValidator } from './availableTimeEntityValidator';

const makeAvailableTimeEntityValidator = new AvailableTimeEntityValidator().init({ joi });

export { makeAvailableTimeEntityValidator };
