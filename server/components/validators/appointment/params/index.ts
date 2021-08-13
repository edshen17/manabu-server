import { joi } from '../../../entities/utils/joi';
import { AppointmentParamsValidator } from './appointmentParamsValidator';

const makeAppointmentParamsValidator = new AppointmentParamsValidator().init({ joi });

export { makeAppointmentParamsValidator };
