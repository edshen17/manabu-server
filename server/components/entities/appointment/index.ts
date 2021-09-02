import { makeAppointmentEntityValidator } from '../../validators/appointment/entity';
import { AppointmentEntity } from './appointmentEntity';

const makeAppointmentEntity = new AppointmentEntity().init({
  makeEntityValidator: makeAppointmentEntityValidator,
});

export { makeAppointmentEntity };
