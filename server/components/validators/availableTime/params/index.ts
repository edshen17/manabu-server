import { joi } from '../../../entities/utils/joi';
import { AvailableTimeParamsValidator } from './availableTimeParamsValidator';

const makeAvailableTimeParamsValidator = new AvailableTimeParamsValidator().init({ joi });

export { makeAvailableTimeParamsValidator };
