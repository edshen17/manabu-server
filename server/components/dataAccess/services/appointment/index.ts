import cloneDeep from 'clone-deep';
import { makeDb } from '../..';
import { Appointment } from '../../../../models/Appointment';
import { makePackageTransactionDbService } from '../packageTransaction';
import { AppointmentDbService } from './appointmentDbService';

const makeAppointmentDbService = new AppointmentDbService().init({
  makeDb,
  dbModel: Appointment,
  cloneDeep,
  makePackageTransactionDbService,
});

export { makeAppointmentDbService };
