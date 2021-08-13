import { joi } from '../../../entities/utils/joi';
import { AppointmentQueryValidator } from './appointmentQueryValidator';

const makeAppointmentQueryValidator = new AppointmentQueryValidator().init({ joi });

export { makeAppointmentQueryValidator };
