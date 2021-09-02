import { joi } from '../../../entities/utils/joi';
import { AppointmentEntityValidator } from './appointmentEntityValidator';
const makeAppointmentEntityValidator = new AppointmentEntityValidator().init({ joi });

export { makeAppointmentEntityValidator };
