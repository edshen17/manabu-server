import { AppointmentEntity } from './appointmentEntity';
import { makeAppointmentEntityValidator } from '../../validators/appointment/entity';

const makeAppointmentEntity = new AppointmentEntity().init({
  makeEntityValidator: makeAppointmentEntityValidator,
});

export { makeAppointmentEntity };
