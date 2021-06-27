import { makePackageTransactionDbService } from '../../dataAccess/services/packageTransaction';
import { makeUserDbService } from '../../dataAccess/services/user';
import { AppointmentEntity } from './appointmentEntity';

const makeAppointmentEntity = new AppointmentEntity().init({
  makeUserDbService,
  makePackageTransactionDbService,
});

export { makeAppointmentEntity };
