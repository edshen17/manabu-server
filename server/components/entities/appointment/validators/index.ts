import { AppointmentEntityValidator } from './appointmentEntityValidator';
import { extendedJoi as joi } from '../../utils/joi/extendedJoi';
const makeAppointmentEntityValidator = new AppointmentEntityValidator().init({ joi });

export { makeAppointmentEntityValidator };
