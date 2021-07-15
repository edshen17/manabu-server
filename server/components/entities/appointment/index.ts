import { makePackageTransactionDbService } from '../../dataAccess/services/packageTransaction';
import { makeUserDbService } from '../../dataAccess/services/user';
import { makeLocationDataHandler } from '../utils/locationDataHandler';
import { AppointmentEntity } from './appointmentEntity';
import { makeAppointmentEntityValidator } from '../../validators/appointment/entity';

const makeAppointmentEntity = new AppointmentEntity().init({
  makePackageTransactionDbService,
  makeUserDbService,
  makeEntityValidator: makeAppointmentEntityValidator,
  makeLocationDataHandler,
});

export { makeAppointmentEntity };
