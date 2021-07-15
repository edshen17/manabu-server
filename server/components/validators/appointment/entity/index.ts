import { AppointmentEntityValidator } from './appointmentEntityValidator';
import { joi } from '../../../entities/utils/joi';
const makeAppointmentEntityValidator = new AppointmentEntityValidator().init({ joi });

export { makeAppointmentEntityValidator };
